package com.odysseusinc.arachne.portal.front;

import static com.odysseusinc.arachne.portal.front.BaseStudyTest.createStudy;
import static com.odysseusinc.arachne.portal.front.ProfileManagerTest.updateName;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitFor;
import static com.odysseusinc.arachne.portal.front.utils.Utils.waitForPageLoad;

import com.google.common.base.Predicate;
import com.odysseusinc.arachne.portal.front.utils.ByBuilder;
import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import org.junit.After;
import org.junit.AfterClass;
import org.junit.Assert;
import org.junit.BeforeClass;
import org.junit.FixMethodOrder;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runners.MethodSorters;
import org.openqa.selenium.Alert;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.ui.WebDriverWait;

@FixMethodOrder(MethodSorters.NAME_ASCENDING)
public class StudyManagerTest extends BaseDataCatalogTest {

    public static final String MODAL_TITLE_CREATE_STUDY = "Create study";
    private static final String MODAL_TITLE_CREATE_ANALYSIS = "Create analysis";
    private static final String MODAL_TITLE_UPDATE_STUDY_TITLE = "Update study title";

    public static final String PLACEHOLDER_STUDY_NAME = "Name of study";
    public static final String PLACEHOLDER_STUDY_TYPE = "Type";
    public static final String PLACEHOLDER_STUDY_TITLE = "Title of study";
    public static final String PLACEHOLDER_ANALYSIS_TITLE = "Title";

    private static final String BEFORE_UPDATING_STUDY_NAME = "TEST Stu";
    private static final String STUDY_NAME = "TEST Study";

    private static final String NAME_DS = "TestNode: Test Data Source 2";
    private static final String NAME_FOR_DELETED_STUDY = "Study For Deleting";

    protected static final BaseStudyTest.StudyData STUDY_DATA =
            new BaseStudyTest.StudyData(BEFORE_UPDATING_STUDY_NAME, "Clinical Trial Design", "Initiate");

    protected static final BaseStudyTest.StudyData STUDY_FOR_DELETING_DATA =
            new BaseStudyTest.StudyData(NAME_FOR_DELETED_STUDY, "Clinical Trial Design", "Initiate");

    private static File file;

    @BeforeClass
    public static void beforeTest() throws IOException {

        updateName(ADMIN_LOGIN, ADMIN_PASSWORD, "4");
        updateName("mr_lead_investigator@example.com", "password", "1");
        updateName("mr_data_set_owner@example.com", "password", "2");
        updateName("mr_collaborator@example.com", "password", "3");

        file = new File("text.txt");
        file.createNewFile();
    }

    @AfterClass
    public static void afterTest() throws IOException {

        file.delete();
    }

    @After
    public void afterEach() throws IOException {

        logout();
    }

    @Test
    public void test01CreateStudy() throws Exception {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        createStudy(STUDY_DATA);
    }

    @Test
    public void test02UpdateStudyTitle() throws Exception {

        loginAndOpenStudy(BEFORE_UPDATING_STUDY_NAME);

        By editBtn = ByBuilder.toolbarEditIco("edit");
        waitFor(driver, editBtn);

        WebElement editStudyButton = driver.findElement(editBtn);
        editStudyButton.click();

        By titleBy = ByBuilder.modal(MODAL_TITLE_UPDATE_STUDY_TITLE);
        waitFor(driver, titleBy);

        WebElement modal = driver.findElement(titleBy);
        WebElement studyTitleInput = modal.findElement(ByBuilder.input(PLACEHOLDER_STUDY_TITLE));
        WebElement studySaveBtn = modal.findElement(ByBuilder.button("Save"));

        String updatedPostfix = "dy";
        studyTitleInput.sendKeys(updatedPostfix);
        studySaveBtn.click();
        waitFor(driver, ByBuilder.toolbarHeader(STUDY_NAME));
    }

    @Test
    public void test03UpdateStudyDescription() throws Exception {

        loginAndOpenStudy();

        By editBtn = ByBuilder.byClassAndText("ac-material-icons", "edit");
        waitForPageLoad(driver, editBtn);

        WebElement editButton = driver.findElement(editBtn);
        editButton.click();

        WebElement description = driver.findElement(ByBuilder.textArea("Add Study Objective"));
        Assert.assertEquals("", description.getText());

        String newDescription = "Long and beautiful description";
        description.sendKeys(newDescription);

        WebElement studyDescriptionBtn = driver
                .findElement(By.className("ac-study-objective-edit"))
                .findElement(ByBuilder.byClassAndText("ac-form__submit", "Save"));

        studyDescriptionBtn.click();

        waitFor(driver, ByBuilder.byClassAndText("ac-study-objective-view", newDescription));
    }

    @Test
    public void test04UpdateStudyType() throws Exception {

        loginAndOpenStudy();

        String studyType = "Clinical Trial Design";

        WebElement studyTypeSelect = driver.findElement(ByBuilder.select(studyType));
        waitFor(driver, ByBuilder.select(studyType));

        String updatedStudyType = "Health Economics and Outcomes";
        WebElement studyTypeOption = driver.findElement(ByBuilder.selectOption(updatedStudyType));

        Actions actions = new Actions(driver);
        actions.moveToElement(studyTypeSelect).click().build().perform();
        actions.moveToElement(studyTypeOption).click().build().perform();

        waitFor(driver, ByBuilder.select(updatedStudyType));
    }

    @Test
    public void test05AddStudyDocument() throws Exception {

        loginAndOpenStudy();

        WebElement studyTypeSelect = driver.findElement(ByBuilder.byClassAndText("ac-study-document-list-add__label", "Add document"));
        studyTypeSelect.click();
        waitFor(driver, ByBuilder.byClassAndText("ac-tabs__item ac-tabs__item--selected", "Computer"));

        WebElement uploadElement = driver.findElement(By.cssSelector("input[type=file]"));
        uploadElement.sendKeys(file.getAbsolutePath());
        driver.findElement(ByBuilder.byClassAndText("ac-form__submit", "Add")).click();
        waitFor(driver, ByBuilder.byClassAndText("ac-link ac-code-file-info__name", "text.txt"));
    }

    @Test
    public void test06RemoveStudyDocument() throws Exception {

        loginAndOpenStudy();
        waitFor(driver, By.className("ac-list-item__remove"));
        WebElement removeIco = driver.findElement(By.className("ac-list-item__remove"));
        removeIco.click();
        acceptAlert();
        waitFor(driver, ByBuilder.byClassAndText("ac-list-item__content", "No documents available"));
    }

    @Test
    public void test07AddStudyParticipant() throws Exception {

        String chosenName = "admin2 admin2";
        inviteParticipant(chosenName, 2);

        WebElement addedRow = driver.findElements(By.className("ac-list-item")).get(0);

        String role = "Lead Investigator";
        Assert.assertTrue(addedRow.findElement(ByBuilder.byClassAndText("ac-select-control__label", role)).isDisplayed());
        Assert.assertEquals("admin2 admin2 admin2", addedRow.findElement(By.className("ac-study-participants-item__name")).getText());
        Assert.assertEquals("PENDING", addedRow.findElement(By.className("ac-study-participants-item__status--pending")).getText());
    }

    protected void inviteParticipant(String chosenName, int chosenUserId) throws Exception {

        loginAndOpenStudy();
        openParticipantsTab();

        WebDriverWait webDriverWait = new WebDriverWait(driver, 3);
        webDriverWait.until((Predicate<WebDriver>) driver -> {

            List<WebElement> rows = driver.findElements(By.className("ac-study-participants-item__name"));
            int size = rows.size();

            Assert.assertEquals("admin4 admin4 admin4", rows.get(size - 1).getText());
            Assert.assertEquals(PORTAL_BASE_URL + "/expert-finder/profile/4", rows.get(size - 1).findElement(By.className("ac-link")).getAttribute("href"));
            return rows.get(size - 1).isDisplayed();
        });

        WebElement studyParticipantAddBtm = driver.findElement(ByBuilder.byClassAndText("ac-list-item__content", "Add participant"));
        studyParticipantAddBtm.click();

        waitFor(driver, ByBuilder.modal("Add participant"));

        WebElement participantRoleSelect = driver.findElement(ByBuilder.select("Contributor"));
        String updatedRole = "Lead Investigator";
        WebElement roleTypeOption = driver.findElement(ByBuilder.selectOption(updatedRole));

        Actions actions = new Actions(driver);
        actions.moveToElement(participantRoleSelect).click().build().perform();
        actions.moveToElement(roleTypeOption).click().build().perform();


        WebElement participantSelect = driver.findElement(ByBuilder.byClassAndText("Select-placeholder", "Search by name"));
        actions = new Actions(driver);
        actions.moveToElement(participantSelect).click().sendKeys("admin" + chosenUserId).build().perform();

        List<WebElement> selectValues = driver.findElements(By.className("Select-option"));
        Assert.assertEquals(1, selectValues.size());

        actions = new Actions(driver);
        actions.moveToElement(selectValues.get(0)).click().build().perform();

        waitFor(driver, ByBuilder.byClassAndText("Select-value-label", chosenName));

        WebElement addBtn = driver.findElements(ByBuilder.button("Add")).get(1);
        addBtn.click();

        waitFor(driver, ByBuilder.byClassAndText("ac-modal__content-title", "Add participant"));

        final By adminEmail = ByBuilder.byClassAndText("ac-study-confirm-participant", "Your invite has been sent to");

        waitFor(driver, ByBuilder.byClassAndText("ac-study-confirm-participant", "Your invite has been sent to"));

        WebElement dialogContent = driver.findElement(adminEmail);
        WebElement added = dialogContent.findElements(By.className("ac-link")).get(0);

        Assert.assertEquals(chosenName, added.getText());
        Assert.assertEquals(PORTAL_BASE_URL + "/expert-finder/profile/" + chosenUserId, added.getAttribute("href"));

        driver.findElement(By.className("ac-modal--active")).findElement(By.className("ac-modal__close-ico")).click();

        webDriverWait = new WebDriverWait(driver, 3);
        webDriverWait.until((Predicate<WebDriver>) driver -> {
            return driver
                    .findElements(By.xpath(".//*[contains(@class, 'ac-select-control__label') and text()='" + updatedRole + "']")).get(1)
                    .isDisplayed();
        });

    }

    private boolean checkParticipantRow(WebElement row, String role, String name, String status) {

        return role.equals(row.findElement(By.className("ac-study-participants-item__role")).getText()) &&
                status.equals(row.findElement(By.className("ac-study-participants-item__status")).getText()) &&
              //row.findElement(ByBuilder.byClassAndText("ac-study-participants-item__status ac-study-participants-item__status--" + status, status)).isDisplayed() &&
                name.equals(row.findElement(By.className("ac-study-participants-item__name")).getText());
    }

    @Test
    public void test14UpdateDates() throws Exception {

        loginAndOpenStudy();

        SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/YYYY");
        String dateLabel = formatter.format(new Date());
        waitFor(driver, By.className("ac-study-date-input__value")); //

        final List<WebElement> dates = driver.findElements(By.className("ac-study-date-input__value"));

        Assert.assertEquals(dateLabel, dates.get(0).getText());
        Assert.assertEquals("Empty", dates.get(1).getText());

        dates.get(0).click();

        WebElement newStartDay = driver.findElement(ByBuilder.byClassAndText("react-datepicker__day", "4"));
        newStartDay.click();

        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 4);
        String newStartDateLabel = formatter.format(calendar.getTime());

        waitFor(driver, ByBuilder.byClassAndText("ac-study-date-input__value", newStartDateLabel));
        waitFor(driver, ByBuilder.byClassAndText("ac-study-date-input__value", "Empty"));
        WebElement endDate = driver.findElements(By.className("ac-study-date-input__value")).get(1);
        endDate.click();

        int lastMonthDay = calendar.getActualMaximum(Calendar.DAY_OF_MONTH);
        waitFor(driver, ByBuilder.byClassAndText("react-datepicker__day", String.valueOf(lastMonthDay)));

        WebElement newEndDay = driver.findElement(ByBuilder.byClassAndText("react-datepicker__day", String.valueOf(lastMonthDay)));
        newEndDay.click();

        calendar.set(Calendar.DAY_OF_MONTH, lastMonthDay);

        waitFor(driver, By.className("ac-study-date-input__value"));
        String updatedEndDateLabel = formatter.format(calendar.getTime());

        waitFor(driver, ByBuilder.byClassAndText("ac-study-date-input__value", updatedEndDateLabel));
        final List<WebElement> resultDates = driver.findElements(By.className("ac-study-date-input__value"));

        Assert.assertEquals(newStartDateLabel, resultDates.get(0).getText());
        Assert.assertEquals(updatedEndDateLabel, resultDates.get(1).getText());
    }

    @Test
    public void test15CreateAnalysis() throws Exception {

        loginAndOpenStudy(STUDY_NAME);
        WebElement addAnalysisBtn = driver
                .findElement(By.className("ac-study-analyses-list"))
                .findElement(ByBuilder.byClassAndText("ac-list-item__content", "Add analysis"));

        addAnalysisBtn.click();

        String analysisType = "Patient Level Prediction";

        WebElement modal = driver.findElement(ByBuilder.modal(MODAL_TITLE_CREATE_ANALYSIS));
        WebElement titleInput = modal.findElement(ByBuilder.input(PLACEHOLDER_ANALYSIS_TITLE));
        WebElement analysisTypeSelect = modal.findElement(ByBuilder.select(PLACEHOLDER_STUDY_TYPE));
        WebElement analysisTypeOption = modal.findElement(ByBuilder.selectOption(analysisType));

        WebElement createBtn = modal.findElement(ByBuilder.button("Create"));

        String analysisName = "Test analysis";
        titleInput.sendKeys(analysisName);

        Actions actions = new Actions(driver);
        actions.moveToElement(analysisTypeSelect).click().build().perform();
        actions.moveToElement(analysisTypeOption).click().build().perform();

        createBtn.click();
        // redirect to analysis page
        waitFor(driver, ByBuilder.toolbar(analysisName));

        // return on study page -> back button
        WebElement backToStudyBtn = driver.findElement(By.className("ac-toolbar__back-icon"));
        backToStudyBtn.click();


        waitFor(driver, ByBuilder.toolbarHeader(STUDY_NAME));

        Assert.assertTrue(driver.findElement(By.className("ac-study-analyses-list"))
                .findElement(ByBuilder.byClassAndText("ac-link", analysisName)).isDisplayed());

    }

    @Test
    public void test16UpdateStudyStatus() throws Exception {

        loginAndOpenStudy(STUDY_NAME);
        String studyStatus = "Active";

        WebElement studyStatusSelect = driver.findElement(
                ByBuilder.byClassAndText("ac-study-status-option__label", studyStatus));

        waitFor(driver, ByBuilder.byClassAndText("ac-study-status-option__label", studyStatus));

        String updatedStudyStatus = "Completed";
        WebElement studyStatusOption = driver.findElement(
                ByBuilder.byClassAndText("ac-study-status-option", updatedStudyStatus));

        Actions actions = new Actions(driver);
        actions.moveToElement(studyStatusSelect).click().build().perform();
        actions.moveToElement(studyStatusOption).click().build().perform();

        waitFor(driver, ByBuilder.byClassAndText("ac-study-status-option__label", updatedStudyStatus));

    }

    @Test
    public void test17AddDatasource() throws Exception {

        loginAndOpenStudy(STUDY_NAME);
        openDatasourcesTab();

        waitFor(driver, ByBuilder.byClassAndText("ac-list-item__content", "No attached data sources"));

        WebElement datasourceAddBtm = driver.findElement(ByBuilder.byClassAndText("ac-list-item__content", "Add Data Source"));
        datasourceAddBtm.click();
        waitFor(driver, ByBuilder.byClassAndText("ac-tabs__item--selected", "Data catalog"));

        WebElement dsSelect = driver.findElement(
                ByBuilder.byClassAndText("Select-placeholder", "Filter by name"));
        Actions actions = new Actions(driver);
        actions.moveToElement(dsSelect).click().sendKeys("2").build().perform();

        Thread.sleep(1000);// todo
        // waitFor(driver, ByBuilder.byClassAndText("ac-label-data-source__name", NAME_DS));

        WebElement dsOption = driver.findElement(
                ByBuilder.byClassAndText("ac-label-data-source__name", NAME_DS));
        actions.moveToElement(dsOption).click().build().perform();

        WebElement addDSBtm = driver.findElement(ByBuilder.button("Add data source"));
        addDSBtm.click();

        waitFor(driver, ByBuilder.byClassAndText("ac-link", NAME_DS));
        List<WebElement> rows = driver.findElements(By.className("ac-list-item__content"));


        Assert.assertTrue(rows.stream()
                .anyMatch(row ->
                        row.findElement(ByBuilder.byClassAndText("ac-link", NAME_DS)).isDisplayed()));
        Assert.assertTrue(rows.stream()
                .anyMatch(row ->
                        row.findElement(ByBuilder.byClassAndText("ac-study-datasource-item__status ac-study-datasource-item__status--approved", "approved")).isDisplayed()));

        openParticipantsTab();
        List<WebElement> participantsRows = driver.findElements(By.className("ac-study-participants-item"));
        //todo
        Assert.assertTrue(participantsRows.stream().anyMatch(row -> checkParticipantRow(row, "Data Set Owner", "admin4 admin4 admin4", "approved")));
        Assert.assertTrue(participantsRows.stream().anyMatch(row -> checkParticipantRow(row, "Lead Investigator", "admin4 admin4 admin4", "approved")));
    }

    @Test
    public void test18RemoveDataSource() throws Exception {

        loginAndOpenStudy();
        openDatasourcesTab();

        waitFor(driver, ByBuilder.byClassAndText("ac-link", NAME_DS));

        WebElement deleteIco = driver.findElement(By.className("ac-study-datasource-item__action"));
        deleteIco.click();

        acceptAlert();

        waitFor(driver, ByBuilder.byClassAndText("ac-link", NAME_DS));

        List<WebElement> datasourceRows = driver.findElements(By.className("ac-list-item__content"));
        //
        Assert.assertTrue(datasourceRows.get(0)
                .findElement(ByBuilder.byClassAndText("ac-link", NAME_DS)).isDisplayed());
        Assert.assertEquals("SUSPENDED", datasourceRows.get(0)
                .findElement(By.className("ac-study-datasource-item__status--suspended")).getText());

        openParticipantsTab();

        List<WebElement> participantsRows = driver.findElements(By.className("ac-study-participants-item"));

        Assert.assertTrue(participantsRows.stream().anyMatch(row -> checkParticipantRow(row, "Data Set Owner", "admin4 admin4 admin4", "disabled")));
        Assert.assertTrue(participantsRows.stream().anyMatch(row -> checkParticipantRow(row, "Lead Investigator", "admin4 admin4 admin4", "approved")));
    }

    @Test
    @Ignore
    public void test19DeleteStudy() throws Exception {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        createStudy(STUDY_FOR_DELETING_DATA);

        waitFor(driver, By.className("ac-study-actions__remove-ico"));

        WebElement delete = driver.findElement(By.className("ac-study-actions__remove-ico"));
        delete.click();
        acceptAlert();

        final By studiesPage = ByBuilder.byClassAndText("ac-toolbar__header", " studies");
        waitFor(driver, studiesPage);

        Assert.assertEquals(0, driver.findElements(ByBuilder.tableRow(NAME_FOR_DELETED_STUDY)).size());
    }

    private void loginAndOpenStudy() {

        loginAndOpenStudy(STUDY_NAME);
    }

    private void loginAndOpenStudy(String name) {

        loginPortal(ADMIN_LOGIN, ADMIN_PASSWORD);
        By studyRow = ByBuilder.tableRow(name);
        waitFor(driver, studyRow);

        WebElement studyInTable = driver.findElement(studyRow);
        studyInTable.click();
    }

    private void acceptAlert() {

        Alert alert = driver.switchTo().alert();
        alert.accept();
    }

    private void openParticipantsTab() {

        waitFor(driver, ByBuilder.tab("Participants"));
        WebElement participantTab = driver.findElement(ByBuilder.tab("Participants"));
        participantTab.click();
    }

    private void openDatasourcesTab() {

        WebElement datasourcesTab = driver.findElement(ByBuilder.tab("Data sources"));
        datasourcesTab.click();
    }
}

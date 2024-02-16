"""Пример решения капчи при авторегистрации Steam"""

from selenium.webdriver.support import expected_conditions as EC
from driver_chrome import ChromeBrowser
from selenium_recaptcha_solver import RecaptchaSolver
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from typing import  Optional
import random
import time


class CustomRecaptchaSolver(RecaptchaSolver):
    def click_recaptcha_v2(self, iframe: WebElement, by_selector: Optional[str] = None) -> None:
        """
        Click the "I'm not a robot" checkbox and then solve a reCAPTCHA v2 challenge.

        Call this method directly on web pages with an "I'm not a robot" checkbox. See <https://developers.google.com/recaptcha/docs/versions> for details of how this works.

        :param iframe: web element for inline frame of reCAPTCHA to solve
        :param by_selector: By selector to use to find the iframe, if ``iframe`` is a string
        :raises selenium.common.exceptions.TimeoutException: if a timeout occurred while waiting
        """

        if isinstance(iframe, str):
            WebDriverWait(self._driver, 150).until(
                ec.frame_to_be_available_and_switch_to_it((by_selector, iframe)))

        else:
            self._driver.switch_to.frame(iframe)

        checkbox = self._wait_for_element(
            by='id',
            locator='recaptcha-anchor',
            timeout=150,
        )

        self._js_click(checkbox)

        if checkbox.get_attribute('aria-checked') == 'true':
            return

        if self._delay_config:
            self._delay_config.delay_after_click_checkbox()

        self._driver.switch_to.parent_frame()

        captcha_challenge = self._wait_for_element(
            by=By.CSS_SELECTOR,
            locator='iframe[src*="ttps://recaptcha.net/recaptcha/enterprise"]',
            timeout=5,
        )

        self.solve_recaptcha_v2_challenge(iframe=captcha_challenge)

    def solve_recaptcha_v2_challenge(self, iframe: WebElement) -> None:
        """
        Solve a reCAPTCHA v2 challenge that has already appeared.

        Call this method directly on web pages with the "invisible reCAPTCHA" badge. See <https://developers.google.com/recaptcha/docs/versions> for details of how this works.

        :param iframe: web element for inline frame of reCAPTCHA to solve
        :raises selenium.common.exceptions.TimeoutException: if a timeout occurred while waiting
        """
        iframe = self._driver.find_elements(By.CSS_SELECTOR,'iframe[src*="ttps://recaptcha.net/recaptcha/enterprise"]')[1]
        self._driver.switch_to.frame(iframe)

        # If the captcha image audio is available, locate it. Otherwise, skip to the next line of code.

        try:
            self._wait_for_element(
                by=By.XPATH,
                locator='//*[@id="recaptcha-audio-button"]',
                timeout=1,
            ).click()

        except TimeoutException:
            pass

        self._solve_audio_challenge()

        # Locate verify button and click it via JavaScript
        verify_button = self._wait_for_element(
            by=By.ID,
            locator='recaptcha-verify-button',
            timeout=5,
        )

        self._js_click(verify_button)

        if self._delay_config:
            self._delay_config.delay_after_click_verify_button()

        try:
            self._wait_for_element(
                by=By.XPATH,
                locator='//div[normalize-space()="Multiple correct solutions required - please solve more."]',
                timeout=1,
            )

            self._solve_audio_challenge()

            # Locate verify button again to avoid stale element reference and click it via JavaScript
            second_verify_button = self._wait_for_element(
                by=By.ID,
                locator='recaptcha-verify-button',
                timeout=5,
            )

            self._js_click(second_verify_button)

        except TimeoutException:
            pass

        self._driver.switch_to.parent_frame()

class RegisterSteam:
    def __init__(self):
        self.driver = ChromeBrowser().get_driver()

    def _get_url(self):
        self.driver.get("https://store.steampowered.com/join")


    def _solve_captcha(self):
        WebDriverWait(self.driver, 20).until(EC.presence_of_element_located((By.XPATH, '//iframe[@title="reCAPTCHA"]')))
        recaptcha_iframe = self.driver.find_element(By.XPATH, '//iframe[@title="reCAPTCHA"]')
        solver = CustomRecaptchaSolver(driver=self.driver)
        solver.click_recaptcha_v2(iframe=recaptcha_iframe)


    def _insert_data(self):

        self.driver.find_element(By.CSS_SELECTOR, "#i_agree_check").click()
        email_str = f"login_fake_email_{str(random.randint(1, 999))}@mail.ru"
        email_str = 'hazibula64575@rambler.ru'
        self.driver.find_element(By.CSS_SELECTOR, "#email").send_keys(email_str)
        self.driver.find_element(By.CSS_SELECTOR, "#reenter_email").send_keys(email_str)

    def new_register(self):
        self._get_url()
        print(1)
        self._solve_captcha()
        print(2)
        self._insert_data()
        self.driver.find_element(By.CSS_SELECTOR, "#createAccountButton").click()


if __name__ == '__main__':
    try:
        RegisterSteam().new_register()
        time.sleep(10)
    except Exception as error:
        print(error)

"""
https://github.com/Duff89
https://youtu.be/64eKYYnOuD8
Получить токен rucaptcha для решения: https://rucaptcha.com/?from=7630153
"""

import time
import re
from python_rucaptcha.re_captcha import ReCaptcha
from selenium.webdriver.common.by import By
from driver_chrome import ChromeBrowser


class FontDownloader:
    """
    Решает ReCaptcha
    """

    def __init__(self, token: str):
        self.driver = ChromeBrowser().get_driver()
        self.token = token

    def download_font(self):
        #self.driver.get("https://allfont.ru/download/arizonia/")
        self.driver.get("https://www.ups.com/track?loc=en_US&tracknum=1Z2E42370304900428&requester=WEMS_1Z/trackdetails")
        time.sleep(20)
        download_btn = self.driver.find_element(By.CSS_SELECTOR, ".view_download_font_block")
        self.driver.execute_script("arguments[0].click();", download_btn)
        self.__solve_captcha()
        # self.__fake_solve()
        self.driver.find_element(By.CSS_SELECTOR, "#accept_rules").click()
        self.driver.find_element(By.CSS_SELECTOR, ".btn_download").click()

        time.sleep(10)

    def __fake_solve(self):
        """Фейковое решение"""
        elem_hidden = self.driver.find_element(By.CSS_SELECTOR, "#g-recaptcha-response")
        self.driver.execute_script("arguments[0].style.display = 'block';", elem_hidden)
        elem_hidden.send_keys("fakeresult")

    def __solve_captcha(self):
        """Решение с помощью rucaptcha"""
        elem_hidden = self.driver.find_element(By.CSS_SELECTOR, "#g-recaptcha-response")
        self.driver.execute_script("arguments[0].style.display = 'block';", elem_hidden)
        token_captcha = self.driver.find_element(By.CSS_SELECTOR, "iframe[title='reCAPTCHA']")
        token_captcha = token_captcha.get_attribute("src")
        regex = r"(?<=k=).+(?=&co=)"
        googlekey = re.search(regex, token_captcha)[0]

        re_captcha = ReCaptcha(
            rucaptcha_key=self.token,
            pageurl=self.driver.current_url,
            googlekey=googlekey,
            method='userrecaptcha'
        )
        result = re_captcha.captcha_handler()
        result = result["captchaSolve"]
        elem_hidden.send_keys(result)


"""Получить токен можно здесь: https://rucaptcha.com/?from=7630153"""
FontDownloader(token='rucaptcha_token').download_font()

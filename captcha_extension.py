import time
from python_rucaptcha.re_captcha import ReCaptcha
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from driver_chrome import ChromeBrowser
from loguru import logger


class CaptchaExtensionExample:
    def __init__(self):
        self.driver = ChromeBrowser(captcha_app=True).get_driver()


    def login(self):
        self.driver.get("https://panel.proxyline.net/login/")
        WebDriverWait(self.driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, "#g-recaptcha-response")))
        WebDriverWait(self.driver, 150).until(EC.text_to_be_present_in_element((By.CSS_SELECTOR, ".captcha-solver-info"), text_="Капча решена!"))
        logger.success("Капча решена успешно!")
        time.sleep(500)


if __name__ == '__main__':
    """Получить токен можно здесь: https://rucaptcha.com/?from=7630153"""
    CaptchaExtensionExample().login()

import time
from python_rucaptcha.re_captcha import ReCaptcha
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from driver_chrome import ChromeBrowser
from loguru import logger


class CaptchaCallback:
    def __init__(self, token: str):
        self.driver = ChromeBrowser().get_driver()
        self.token = token

    def __get_sitekey(self) -> str:
        iframe_src = self.driver.find_element(By.TAG_NAME, "iframe").get_attribute("src")
        sitekey = iframe_src.split("k=")[1].split("&")[0]
        logger.debug(sitekey)
        return sitekey

    def __solve_captcha(self) -> str:
        recaptcha = ReCaptcha(
            rucaptcha_key=self.token,
            pageurl=self.driver.current_url,
            googlekey=self.__get_sitekey(),
            method='userrecaptcha'
        )
        result = recaptcha.captcha_handler()
        result = result['captchaSolve']
        logger.debug(result)
        return result

    def __calback(self, result: str):
        symbols = 'QWERTYUIOPASDFGHJKLZXCVBNM'
        for symbol in symbols:
            try:
                resp = self.driver.execute_script(f"return ___grecaptcha_cfg.clients['0']['{symbol}']['{symbol}']")
                if 'callback' in resp:
                    self.driver.execute_script(
                        f"___grecaptcha_cfg.clients['0']['{symbol}']['{symbol}']['callback']('{result}')")
                    logger.success(f"Сегодня буква {symbol}")
                    break
            except Exception:
                pass

    def login(self):
        self.driver.get("https://visa.vfsglobal.com/mlt/ru/pol/login")
        WebDriverWait(self.driver, 20).until(EC.presence_of_element_located((By.CSS_SELECTOR, "#g-recaptcha-response")))
        result = self.__solve_captcha()
        self.__calback(result)

        self.driver.find_element(By.CSS_SELECTOR, "input[placeholder='jane.doe@email.com']").send_keys(
            "test1@email.org")
        self.driver.find_element(By.CSS_SELECTOR, "input[type='password']").send_keys("Pass123456!")

        logger.success("finish")
        time.sleep(100)


if __name__ == '__main__':
    """Получить токен можно здесь: https://rucaptcha.com/?from=7630153"""
    CaptchaCallback(token='token').login()

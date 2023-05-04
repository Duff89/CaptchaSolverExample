import time

from python_rucaptcha.image_captcha import ImageCaptcha
from selenium.webdriver.common.by import By
from driver_chrome import ChromeBrowser


class CheckProxy:
    """
    Решает ImageCaptcha и проверяет прокси
    """
    def __init__(self, proxy: str, token: str):
        self.driver = ChromeBrowser().get_driver()
        self.image_captcha = ImageCaptcha(rucaptcha_key=token)
        self.proxy = proxy

    def __get_url(self):
        """Переходит по адресу"""
        self.driver.get('https://proxy6.net/checker')

    def __get_image(self):
        """Получает и сохраняет изображение капчи в файл"""
        image_elem = self.driver.find_element(By.CSS_SELECTOR, "#captcha")
        image_elem.screenshot("captcha.png")

    def __solver_captcha(self):
        """Отправляет на решение и получает результат"""
        text_captcha = self.image_captcha.captcha_handler(captcha_file="captcha.png")['captchaSolve']
        text_captcha = str(text_captcha).upper()
        self.__insert_result(result=text_captcha)

    def __insert_result(self, result: str):
        """Вставляет решение"""
        self.driver.find_element(By.CSS_SELECTOR, "input[name='sec_code']").send_keys(result)

    def __insert_proxy(self):
        """Вставляет прокси"""
        self.driver.find_element(By.CSS_SELECTOR, "textarea[name='list']").send_keys(self.proxy)

    def __check_btn(self):
        """Нажимает на кнопку проверить"""
        self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    def check_proxy(self):
        self.__get_url()
        self.__get_image()
        self.__solver_captcha()
        self.__insert_proxy()
        self.__check_btn()
        time.sleep(10)


RUCAPTCHA_TOKEN = ''  # вставьте токен с сайта https://rucaptcha.com/?from=7630153
PROXY = ''  # прокси который нужно проверить
CheckProxy(proxy=PROXY,
           token=RUCAPTCHA_TOKEN).check_proxy()

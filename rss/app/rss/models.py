# coding=utf-8
# from django.db import models
# import MySQLdb,sys,re,pickle

# Create your models here.
# from django.db import connection

import logging
import re
import threading
import urllib2
import json
import sys
import random
import time
from selenium import webdriver
reload(sys)
sys.setdefaultencoding('utf-8')

try:
    import xml.etree.cElementTree as etree
except ImportError:
    import xml.etree.ElementTree as etree

def full_text_rss(url):
    print "begin"

    html = urllib2.urlopen(url).read()
    html = re.sub("<description>[\s\S]*?</description>","",html)
    html = re.sub("<content.*?>","<description>",html)
    html = re.sub("</content.*?>","</description>",html)
    return html

class WeiXin():
    def __init__(self):
        self.mutex = threading.Lock()
        if sys.platform == "win32":
            self.driver = webdriver.PhantomJS("D:\phantomjs-1.9.7-windows\phantomjs.exe")
        else:
            self.driver = webdriver.PhantomJS()
        self.useragent=['Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
                        'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-us) AppleWebKit/534.50 (KHTML, like Gecko) Version/5.1 Safari/534.50',
                        'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; Trident/5.0',
                        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)',
                        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
                        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; TencentTraveler 4.0)',
                        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Maxthon 2.0)',
                        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; The World)',
                        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Trident/4.0; SE 2.X MetaSr 1.0; SE 2.X MetaSr 1.0; .NET CLR 2.0.50727; SE 2.X MetaSr 1.0)',
                        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1; Avant Browser)',
                        'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 5.1)',
                        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_0) AppleWebKit/535.11 (KHTML, like Gecko) Chrome/17.0.963.56 Safari/535.11',
                        'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36'
                        ]
    def get_html(self,url,is_js=False):
        print "url:",url
        if is_js:
            self.driver.get(url)
        return self.driver.page_source

        user_agent = random.choice(self.useragent)
        headers = {
            'User-Agent': user_agent,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Encoding': 'deflate, sdch',
            'Accept-Language': 'zh-CN,zh;q=0.8,zh-TW;q=0.6',
            'Connection': 'keep-alive',
            'Host': 'weixin.sogou.com',
            'DNT': '1',
            'Cache-Control': 'max-age=0',
            'Cookie':"SUV=" + str(int(time.time()*1000))+str(int(random.random()*1000))+";path=/;expires=Sun, 29 July 2046 00:00:00 UTC;domain="+".soso.com"
            }
        request = urllib2.Request(url, headers=headers)
        response = urllib2.urlopen(request)
        html = response.read()
        return html
    def get_items(self,openid):
        link = "http://weixin.sogou.com/gzh?openid={0}".format(openid)

        html = self.get_html(link,is_js=True)

        logging.info(openid)
        logging.info(link)
        print html

        weixin_name = re.search("<h3 id=\"weixinname\">(.*?)</h3>", html).group(1)
        description = re.search("<span class=\"sp-txt\">(.*?)</span>", html).group(1)
        items = {"title": weixin_name, "description": description, "link": link, "items": []}

        js_url = "http://weixin.sogou.com/gzhjs?cb=sogou.weixin.gzhcb&openid={0}".format(openid)
        js = urllib2.urlopen(js_url).read()
        json_text = re.search("sogou.weixin.gzhcb\((.*)\)", js).group(1)
        json_text = json_text.replace("\\\"", "\'")
        json_text = json_text.replace('gbk', 'utf-8')
        json_items = json.loads(json_text)

        threads = []
        for i,xml in enumerate(json_items['items']):
            tree = etree.fromstring(xml)
            title = tree.findall("./item/display/title")[0].text
            url = tree.findall("./item/display/url")[0].text

            item = {"link": url, "title": title}
            # print item
            items["items"].append(item)
            t = threading.Thread(target=self.get_content, args=(item,))
            t.start()
            threads.append(t)
        for t in threads:
            t.join(5)

        return items

    def get_content(self, item):
        link = item["link"]
        html = self.get_html(link)

        html_inner = re.search(
            r"<div class=\"rich_media_inner\">[\s\S]*<div class=\"rich_media_tool\" id=\"js_toobar\">", html).group()
        if html_inner:
            html = html_inner
        html = html.replace("<div class=\"rich_media_tool\" id=\"js_toobar\">", "")
        html = re.sub(r"(<img.*?data-src=)(\".*?\")(.*?/>)", "<img src=\\2 />", html)
        item["content"] = html


if __name__=="__main__":
    a = NewWeiXin()
    print a.get_items('oIWsFt_6y60Gtq6sf_5_aAYWs4aE')
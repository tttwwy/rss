# coding=utf-8
# from django.db import models
# import MySQLdb,sys,re,pickle

# Create your models here.
# from django.db import connection
from selenium import webdriver
import logging
import re
import threading
import urllib2
import sys

def full_text_rss(url):
    print "begin"

    html = urllib2.urlopen(url).read()
    html = re.sub("<description>[\s\S]*?</description>","",html)
    html = re.sub("<content.*?>","<description>",html)
    html = re.sub("</content.*?>","</description>",html)
    return html


class WeiXin():
    def __init__(self):
        if sys.platform == "win32":
            self.driver = webdriver.PhantomJS("D:\phantomjs-1.9.7-windows\phantomjs.exe")
        else:
            self.driver = webdriver.PhantomJS()

        self.mutex = threading.Lock()

    def get_items(self, openid):
        self.driver.get("http://weixin.sogou.com/gzh?openid=" + openid)
        weixin_name = self.driver.find_element_by_id("weixinname").text
        description = self.driver.find_element_by_class_name("sp-txt").text
        link = "http://weixin.sogou.com/gzh?openid=" + openid
        html = self.driver.page_source

        items = {"title": weixin_name, "description": description, "link": link, "items": []}
        result = re.findall("<a class=\"news_lst_tab\".*?href=\"(http://.*?)\">(.*?)</a>", html)

        threads = []
        for i, list in enumerate(result):
            # print i
            item = {"link": list[0], "title": list[1]}
            items["items"].append(item)
            t = threading.Thread(target=self.get_content, args=(items, i))
            t.start()
            threads.append(t)

        for t in threads:
            t.join(5)
        self.driver.close()
        return items

    def get_content(self, items, i):
        print i, "begin"
        link = items["items"][i]["link"]
        html = urllib2.urlopen(link).read()

        html_inner = re.search(r"<div class=\"rich_media_inner\">[\s\S]*<div class=\"rich_media_tool\" id=\"js_toobar\">", html).group()
        if html_inner:
            html = html_inner
        html = html.replace("<div class=\"rich_media_tool\" id=\"js_toobar\">","")
        html = re.sub(r"(<img.*?data-src=)(\".*?\")(.*?/>)", "<img src=\\2 />", html)
        self.mutex.acquire(3)
        items["items"][i]["content"] = html
        self.mutex.release()

    def get_weixin_list(self, query):
        query = urllib2.quote(query)
        self.driver.get("http://weixin.sogou.com/weixin?type=1&query=" + query)

if __name__=="__main__":
    print "begin"
    print full_text_rss("http://www.geekonomics10000.com/feed")
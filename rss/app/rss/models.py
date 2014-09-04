#coding=utf-8
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
from htmlentitydefs import codepoint2name, name2codepoint
import cgi



# import HTMLParser
table_name = "basic_data_new"
class WeiXin():
    def __init__(self):
        if sys.platform == "win32":
            self.driver = webdriver.PhantomJS("D:\phantomjs-1.9.7-windows\phantomjs.exe")
        else:
            self.driver = webdriver.PhantomJS()

        self.mutex = threading.Lock()
    def get_items(self,openid):
        self.driver.get("http://weixin.sogou.com/gzh?openid=" + openid)
        weixin_name = self.driver.find_element_by_id("weixinname").text
        description = self.driver.find_element_by_class_name("sp-txt").text
        link = "http://weixin.sogou.com/gzh?openid=" + openid
        html = self.driver.page_source

        items = {"title":weixin_name,"description":description,"link":link,"items":[]}
        result =  re.findall("<a class=\"news_lst_tab\".*?href=\"(http://.*?)\">(.*?)</a>",html)

        threads = []
        for i,list in enumerate(result):
            # print i
            item = {"link":list[0],"title":list[1]}
            items["items"].append(item)
            t = threading.Thread(target=self.get_content,args=(items,i))
            t.start()
            threads.append(t)

        for t in threads:
            t.join()
        self.driver.close()
        return items

    # def get_content(self,items,i):
    #     self.mutex.acquire(10)
    #     link = items["items"][i]["link"]
    #     self.driver.get(link)
    #     html =  self.driver.find_element_by_id("page-content").get_attribute("innerHTML")
    #     items["items"][i]["content"] = html
    #     self.mutex.release()

    def get_content(self,items,i):

        print i,"begin",
        link = items["items"][i]["link"]
        html = urllib2.urlopen(link).read()
        html = cgi.escape(html)
        # html = re.search(r"<div class=\"rich_media_inner\">[\s\S]*</div>",html).group()
        # print html
        # html = re.subn("<script type=.*>[\s\S]*?</script>","",html)[0]
        # self.driver.get(link)
        # html =  self.driver.find_element_by_id("page-content").get_attribute("innerHTML")
        self.mutex.acquire(10)
        items["items"][i]["content"] = html
        print i,"end",
        self.mutex.release()



    def get_weixin_list(self,query):
        query = urllib2.quote(query)
        self.driver.get("http://weixin.sogou.com/weixin?type=1&query=" + query)
        print self.driver.page_source
        # weixin_name = self.driver.find_element_by_id("weixinname").text



#
# weixin = WeiXin()
# weixin.get_weixin_list("小道消息")
# # weixin.get_content("http://mp.weixin.qq.com/s?__biz=MzA3NDM0ODQwMw==&mid=202599201&idx=1&sn=34f906dbc2fc91de821e261693ea978a&3rd=MzA3MDU4NTYzMw==&scene=6#rd")
# items = weixin.get_items("oIWsFt_6y60Gtq6sf_5_aAYWs4aE")
# for item in items["items"]:
#     print item


# print urllib2.urlopen("http://mp.weixin.qq.com/s?__biz=MzA3NDM0ODQwMw==&amp;mid=202636445&amp;idx=1&amp;sn=f6352dcd7886a5c727182b18ec3aa058&amp;3rd=MzA3MDU4NTYzMw==&amp;scene=6#rd%22%20id=%22sogou_vr_11002601_title_0").read()


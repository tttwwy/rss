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
import xml.dom.minidom
reload(sys)
sys.setdefaultencoding("utf-8")
from django.utils.six import StringIO
class Rss():
    def __init__(self,title,link,description,language="zh-cn"):
        impl = xml.dom.minidom.getDOMImplementation()
        self.dom = impl.createDocument(None, 'rss', None)
        self.title = title
        self.link = link
        self.description = description
        self.language = language

        self.channel = self.dom.createElement('channel')


    def makeEasyTag(self,tagname, value, type='text'):
             tag = self.dom.createElement(tagname)
             if value.find(']]>') > -1:
                 type = 'text'
             if type == 'text':
                 value = value.replace('&', '&amp;')
                 value = value.replace('<', '&lt;')
                 text = self.dom.createTextNode(value)
             elif type == 'cdata':
                 text = self.dom.createCDATASection(value)
             tag.appendChild(text)
             return tag

    def add_item(self,title,description,link):
        description = description.decode('utf-8')
        item = self.dom.createElement('item')
        item.appendChild(self.makeEasyTag("title",title,'text'))
        item.appendChild(self.makeEasyTag("link",link,'text'))
        item.appendChild(self.makeEasyTag("description",description,"cdata"))

        self.channel.appendChild(item)

    def write(self,outfile,encoding='utf-8'):
        root = self.dom.documentElement
        root.setAttribute('version','2.0')
        self.channel.appendChild(self.makeEasyTag("title",self.title))
        self.channel.appendChild(self.makeEasyTag("link",self.link))
        self.channel.appendChild(self.makeEasyTag("description",self.description))
        self.channel.appendChild(self.makeEasyTag("language",self.language))
        root.appendChild(self.channel)
        outfile.write(root.toprettyxml())
        # self.dom.writexml(outfile,encoding)

    def writeString(self,encoding='utf-8'):
        root = self.dom.documentElement
        root.setAttribute('version','2.0')
        self.channel.appendChild(self.makeEasyTag("title",self.title))
        self.channel.appendChild(self.makeEasyTag("link",self.link))
        self.channel.appendChild(self.makeEasyTag("description",self.description))
        self.channel.appendChild(self.makeEasyTag("language",self.language))
        root.appendChild(self.channel)
        return root.toprettyxml()

        # s = StringIO()
        # self.write(s,encoding)
        # return s.getvalue()

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
            t.join(5)
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
        print i,"begin"
        link = items["items"][i]["link"]
        # self.driver.get(link)
        # html =  self.driver.find_element_by_id("page-content").get_attribute("innerHTML")
        html = urllib2.urlopen(link).read()
        html = re.search(r"<div class=\"rich_media_inner\">[\s\S]*</div>",html).group()
        html = re.sub(r"(<img.*?data-src=)(\".*?\")(.*?/>)","<img src=\\2 />",html)
        self.mutex.acquire(3)

        items["items"][i]["content"] = html

        self.mutex.release()
        print i,"end"

    # def get_content(self,items,i):
    #
    #     print i,"begin"
    #     link = items["items"][i]["link"]
    #     html = urllib2.urlopen(link).read()
    #     # html = cgi.escape(html)
    #     html = re.search(r"<div class=\"rich_media_inner\">[\s\S]*</div>",html).group()
    #     # print html
    #     # html = re.subn("<script type=.*>[\s\S]*?</script>","",html)[0]
    #     # self.driver.get(link)
    #     # html =  self.driver.find_element_by_id("page-content").get_attribute("innerHTML")
    #     self.mutex.acquire(10)
    #     items["items"][i]["content"] = html
    #
    #     self.mutex.release()
    #     print i,"end"



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

# rss_generate()

# link = '''http://mp.weixin.qq.com/s?__biz=MzA5MTkzMTUzOA==&amp;amp;mid=200813666&amp;amp;idx=1&amp;amp;sn=ce23a650300da4b9485d4ec4a3c536f5&amp;amp;3rd=MzA3MDU4NTYzMw==&amp;amp;scene=6#rd" id="sogou_vr_11002601_title_0'''
# html =  urllib2.urlopen(link).read()
# print html
# print re.sub(r"(<img.*?data-src=)\"(.+?\")(.*?/>)","<img src=\\2 />",html)
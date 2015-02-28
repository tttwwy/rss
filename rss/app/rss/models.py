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

    def get_items(self,openid):
        link = "http://weixin.sogou.com/gzh?openid={0}".format(openid)
        html = urllib2.urlopen(link).read()
        logging.info(openid)
        logging.info(link)
        logging.info(html)

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
        html = urllib2.urlopen(link).read()

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
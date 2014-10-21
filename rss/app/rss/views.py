#coding=utf-8
from django.template.loader import get_template
from django.template import Context
from django.template import Template
from django.http import HttpResponse
from django.shortcuts import render_to_response
from django.db import connection
import json
import models
import logging
from django.contrib.syndication.views import Feed
from django.utils import feedgenerator
from django.core.cache import cache

# 主页
#
# class WeixinRss(Feed):
#     def __init__(self,request,openid):
#         self.title = ""
#         self.link = ""
#         self.description = ""
#
#     def get_object(self, request, openid):
#         return openid
#
#     def items(self,openid):
#         # print openid
#         items = cache.get(openid)
#         if not items:
#             weixin = models.WeiXin()
#             items = weixin.get_items(openid)
#             cache.set(openid,items)
#
#         self.title = items["title"]
#         self.description = items["description"]
#         self.link = items["link"]
#         return items["items"]
#     #订阅的标题
#     def item_title(self, item):
#         return item["title"]
#     #订阅的表示
#     def item_description(self, item):
#         return item["content"]
#     #每条订阅的链接
#     def item_link(self,item):
#         return item["link"]

def index(request):
    logging.info("hello open")
    # t = get_template('index.html')
    # context = Context({'top_words':models.get_hot_query(4)})
    # html = t.render(context)
    # return HttpResponse(t)
    return render_to_response('index.html')
    # return HttpResponse("hello")

def feed(request,openid):
    # print "feed"
    # print openid
    str = cache.get(openid)
    if not str:
        weixin = models.WeiXin()
        items = weixin.get_items(openid)

        feed = feedgenerator.Rss201rev2Feed(
            title=items["title"],
            link=items["link"],
            description=items["description"],
            language="zh-cn"
        )
        for item in items["items"]:
            feed.add_item(title=item["title"],description=item["content"],link=item["link"])
        str = feed.writeString('utf-8')

        cache.set(openid,str)

    return HttpResponse(str)




def feed_new(request,openid):
    str = cache.get(openid)
    if not str:
        weixin = models.WeiXin()
        items = weixin.get_items(openid)
        feed = models.Rss(
            title=items["title"],
            link=items["link"],
            description=items["description"],
            language="zh-cn"
        )
        for item in items["items"]:
            feed.add_item(title=item["title"],description=item["content"],link=item["link"])
        str = feed.writeString('')

        cache.set(openid,str)

    return HttpResponse(str)


def format(str):
	new_str = str.replace('&', '&amp;')
	new_str = str.replace('<', '&lt;')
	# new_str = str.replace('\n\n', '\n')
	return new_str

# rss_generate()
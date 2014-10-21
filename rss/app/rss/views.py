# coding=utf-8
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



def index(request):
    logging.info("hello open")
    return render_to_response('index.html')

def full_text_feed(request,url):
    html = ""
    if url:
        url = url.replace("http://","")
        url = "http://" + url
        html = models.full_text_rss(url)
    return HttpResponse(html)

def feed(request, openid):
    logging.info(openid)
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
            feed.add_item(title=item["title"], description=item["content"], link=item["link"])
        str = feed.writeString('utf-8')

        cache.set(openid, str)

    return HttpResponse(str)

#
# def feed_new(request, openid):
#     str = cache.get(openid)
#     if not str:
#         weixin = models.WeiXin()
#         items = weixin.get_items(openid)
#         feed = models.Rss(
#             title=items["title"],
#             link=items["link"],
#             description=items["description"],
#             language="zh-cn"
#         )
#         for item in items["items"]:
#             feed.add_item(title=item["title"], description=item["content"], link=item["link"])
#         str = feed.writeString('')
#
#         cache.set(openid, str)
#
#     return HttpResponse(str)
#
#
# def format(str):
#     new_str = str.replace('&', '&amp;')
#     new_str = str.replace('<', '&lt;')
#     # new_str = str.replace('\n\n', '\n')
#     return new_str
#
#     # rss_generate()
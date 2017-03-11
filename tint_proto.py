from handlers.base import BaseHandler


from io import StringIO
from lxml import etree

import tornado.gen
from executor import executor

import logging
logger = logging.getLogger('boilerplate.' + __name__)

def urls():
	return [
		(r"/tint", TintHandler),
	]


class TintHandler(BaseHandler):

	
	@tornado.gen.coroutine
	def get(self):
		self.render("tint_form.html")

	@tornado.gen.coroutine
	def post(self):
		xmlData = self.get_argument("xmlData")
		try:
			xmlTree = yield executor.submit(etree.parse, StringIO(xmlData))
			#xmlTree = etree.parse(StringIO(xmlData))
			self.write({"success": True, "testReturnData": xmlData})
		except Exception as e:
			self.return_error(404, e)
		


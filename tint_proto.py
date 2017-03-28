from handlers.base import BaseHandler


from io import StringIO
from lxml import etree

import tornado.gen
from executor import executor

import logging
logger = logging.getLogger('boilerplate.' + __name__)


'''
# Perhaps not a good idea to put these here?

def urls():
	return [
		(r"/tint", TintHandler),
	]
'''
ITEMS = {x: {"itemIdentifier": x, "title": title, "xml": "blank"} for x, title \
			in enumerate(["Boring Letter", "Shite Letter", "Letter from Spender"]) }


class TintAll(BaseHandler):

	def get(self):
		self.render('tint_all.html', items=ITEMS)


class TintItem(BaseHandler):

	
	
	@tornado.gen.coroutine
	def get(self, itemIdentifier):
		
		data = ITEMS[int(itemIdentifier)]
		self.render("tint_form.html", item=data)

	@tornado.gen.coroutine
	def post(self, itemIdentifier):
		xmlData = self.get_argument("xmlData")
		try:
			print(xmlData)
			xmlTree = yield executor.submit(etree.parse, StringIO(xmlData))
			ITEMS[int(itemIdentifier)]['xml'] = xmlData
			self.write({"success": True, "itemIdentifier": itemIdentifier, "testReturnData": xmlData})
		except Exception as e:
			self.return_error(404, {"error": e, "itemIdentifier": itemIdentifier})
		


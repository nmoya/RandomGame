import urllib2
import urllib
import time

#http://www.behindthename.com/random/

NUMBER_OF_NAMES = 100
TIMEOUT = 0.01


def main():
    r = Remote()
    r.updateInternetState()
    if r.internetAvailable:
        for i in range(NUMBER_OF_NAMES):
            html = r.getHTMLFromLink("http://www.behindthename.com/random/random.php?number=1&gender=both&surname=&all=no&usage_grem=1&usage_grea=1&usage_roma=1&usage_hist=1")
            html = html[html.find("plain"):]
            name = html[html.find(">")+1:html.find("<")]
            print name
            time.sleep(TIMEOUT)



######################
#REMOTE FUNCTIONS
######################
class Remote():
    def __init__(self):
        self.internetAvailable = self.updateInternetState()

    # the_page = response.read()
    def requestHTTP(self, link, formData=dict()):
        if self.internetAvailable:
            data = urllib.urlencode(formData)
            req = urllib2.Request(link, data)
            response = None
            try:
                response = urllib2.urlopen(req)
            except Exception:
                print "An error has ocurred: ", link
                if len(formData) != 0:
                    print "The following data was passed: "
                    for key in formData:
                        print key, ":", formData[key]
            return response

    def getHTMLFromLink(self, link, formData=dict()):
        if self.internetAvailable:
            response = self.requestHTTP(link, formData)
            return response.read()

    def validateLink(self, link):
        if self.internetAvailable:
            try:
                resp = urllib2.urlopen(link)
            except Exception:
                return False
            return resp.code == 200

    def updateInternetState(self):
        try:
            #Using IP instead of DNS makes the process quicker
            urllib2.urlopen("http://201.82.108.99", timeout=1)
        except Exception:
            self.internetAvailable = False
            return False
        self.internetAvailable = True
        return True

    def isOnline(self):
        return self.internetAvailable

    def downloadFile(self, link, directory, name=""):
        if self.internetAvailable:
            if name == "":
                name = link.split("/")[-1]
            try:
                urllib.urlretrieve(link, directory + name)
            except Exception:
                print "[FAILED] File:", name
            return


main()

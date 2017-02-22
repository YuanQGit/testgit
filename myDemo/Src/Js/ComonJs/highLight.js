
export  default function HighlightString() {
    this.KeyWords = null;
    this.CssBegin = "<font style='color:red'>";
    this.CssEnd = "</font>";
    this.Text = null;
    this.formatKeyword = function (content, keyword) {
        keyword = keyword.replace(/(^\s*)|(\s*$)/g, "");
        if (keyword == '')
            return content;
        var reg = new RegExp('(' + keyword + ')', 'gi');
        return content.replace(reg, this.CssBegin + '$1' + this.CssEnd);
    }
    this.refreshContent = function (contentID) {
        var content;
        if (this.Text == null)
            content = document.getElementById(contentID).innerHTML;
        else
            content = this.Text;

        for (var i = 0; i < this.KeyWords.length; i++) {
            var strKey = this.KeyWords[i].toString();
            var arrKey = strKey.split(',');
            for (var j = 0; j < arrKey.length; j++) {
                var key = arrKey[j];
                content = this.formatKeyword(content, key);
            }
        }
        if (this.Text == null) {
            document.getElementById(contentID).innerHTML = content;
            return null;
        } else
            return content;
    }
};

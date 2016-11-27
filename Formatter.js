function DiffFormatter()
{
    this.diff = null;
}
DiffFormatter.prototype.format = function(diff, container)
{
    this.diff = diff;

    var self = this;
    var table = $('<table></table>');
    container.html(table);

    for (var i = 0; i < diff.files.length; i++) {
        var file = diff.files[i];
        var fileHtml = '<tr class="file-row"><td colspan="2"><b>'+file.nameA+'</b></td><td colspan="2"><b>'+file.nameB+'</b></td></tr>';
        var lineNum = 0;

        for (var ii = 0; ii < file.chunks.length; ii++) {
            var chunk = file.chunks[ii];
            fileHtml += '<tr><td colspan="4"><hr></td></tr>';

            for (var iii = 0; iii < chunk.versionA.rows.length; iii++) {
                lineNum++;

                var rowA = chunk.versionA.rows[iii];
                var rowB = chunk.versionB.rows[iii];

                var textA = self.escapeHtml(rowA.text || ' ');
                var textB = self.escapeHtml(rowB.text || ' ');

                var classA = '';
                var classB = '';

                if (rowA.type === '+') {
                    classA = 'added';
                } else if (rowA.type === '-') {
                    classA = 'removed';
                } else {
                    classA = '';
                }

                if (rowB.type === '+') {
                    classB = 'added';
                } else if (rowB.type === '-') {
                    classB = 'removed';
                } else {
                    classB = '';
                }

                fileHtml += '<tr><td class="line-num">'+lineNum+'</td><td class="'+classA+'"><pre>'+textA+'</pre></td><td class="line-num">'+lineNum+'</td><td class="'+classB+'"><pre>'+textB+'</pre></td></tr>';
            }
        }

        table.append(fileHtml);
    }

    return table;
};
DiffFormatter.prototype.escapeHtml = function(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};
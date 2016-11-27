function DiffFormatter()
{
    this.diff = null;
    this.container = null;
    this.table = null;
    this.lineCounter = 0;
}
DiffFormatter.prototype.format = function(diff, container)
{
    this.diff = diff;
    this.container = container;
    this.table = $('<table></table>');
    this.container.html(this.table);

    for (var i = 0; i < diff.files.length; i++) {
        window.setTimeout(function(i) {
            this.formatFile(diff.files[i]);
        }.bind(this, i), 0);
    }

    return this.table;
};

DiffFormatter.prototype.formatFile = function(file)
{
    this.lineCounter = 0;
    var html = '<tr class="file-row"><td colspan="2"><b>'+file.nameA+'</b></td><td colspan="2"><b>'+file.nameB+'</b></td></tr>';

    for (var i = 0; i < file.chunks.length; i++) {
        html += this.formatChunk(file.chunks[i]);
    }

    this.table.append(html);
};

DiffFormatter.prototype.formatChunk = function(chunk)
{
    var html = '<tr><td colspan="4"><hr></td></tr>';

    for (var i = 0; i < chunk.versionA.rows.length; i++) {
        html += this.formatRow(chunk.versionA.rows[i], chunk.versionB.rows[i]);
    }

    return html;
};

DiffFormatter.prototype.formatRow = function(rowA, rowB)
{
    this.lineCounter++;

    var textA = this.escapeHtml(rowA.text || ' ');
    var textB = this.escapeHtml(rowB.text || ' ');

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

    return '<tr>' +
        '<td class="line-num">'+this.lineCounter+'</td>' +
        '<td class="'+classA+'"><pre>'+textA+'</pre></td>' +
        '<td class="line-num">'+this.lineCounter+'</td>' +
        '<td class="'+classB+'"><pre>'+textB+'</pre></td>' +
    '</tr>';
};

DiffFormatter.prototype.escapeHtml = function(text)
{
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
};
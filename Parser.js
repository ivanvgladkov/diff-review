function DiffParser()
{
    this.rowCounter = 0;
    this.lineReader = null;
    this.state = null;

    this.diff = null;
    this.currentFile = null;
    this.currentChunk = null;
    this.rowsBalance = 0;

    this.callback = function() {};

    this.initLineReader();
}

DiffParser.prototype.initLineReader = function()
{
    var self = this;

    this.lineReader = new LineReader({
        chunkSize: 1024*100
    });

    this.lineReader.on('line', function (line, next) {
        self.rowCounter++;
        self.parseLine(line);
        next();
    });

    this.lineReader.on('error', function (err) {
        console.log(err);
    });

    this.lineReader.on('end', function () {
        self.callback(self.diff);
        console.log('Read complete!');
    });
};

DiffParser.prototype.parse = function(file, callback)
{
    this.callback = callback;
    this.diff = new Diff();
    this.rowCounter = 0;
    this.lineReader.read(file);
};

DiffParser.prototype.parseLine = function(line)
{
    if (line.indexOf('diff --git') === 0) {
        this.balanceRows();

        var file = new File();
        this.diff.files.push(file);
        this.currentFile = file;
        this.state = 'FILE';

        return;
    }

    if (line.indexOf('deleted') === 0) {
        return;
    }

    if (line.indexOf('index') === 0) {
        return;
    }

    if (line.indexOf('deleted') === 0) {
        return;
    }

    if (line.indexOf('--- a/') === 0) {
        this.currentFile.nameA = line.slice(6);
        return;
    }

    if (line.indexOf('+++ b/') === 0) {
        this.currentFile.nameB = line.slice(6);
        return;
    }

    if (line.indexOf('+++ /dev/null') === 0) {
        this.currentFile.nameB = 'File was removed';
        return;
    }

    if (line.indexOf('@@') === 0) {
        this.balanceRows();

        var chunk = new Chunk();
        this.currentChunk = chunk;
        this.currentFile.chunks.push(chunk);

        return;
    }

    if (line.indexOf('\\ No newline at end of file') === 0) {
        return;
    }


    if (this.currentChunk !== null) {

        var row = null;

        if (line.slice(0, 1) === ' ') {
            this.balanceRows();
            row = new Row(line.slice(1), '=');

            this.currentChunk.versionA.rows.push(row);
            this.currentChunk.versionB.rows.push(row);
            return;
        }

        if (line.slice(0, 1) === '-') {
            row = new Row(line.slice(1), '-');

            this.rowsBalance++;
            this.currentChunk.versionA.rows.push(row);
            return;
        }

        if (line.slice(0, 1) === '+') {
            row = new Row(line.slice(1), '+');

            this.rowsBalance--;
            this.currentChunk.versionB.rows.push(row);
            return;
        }
    }

    console.log('Not parsed line: ' + line);
};

DiffParser.prototype.balanceRows = function()
{
    if (this.rowsBalance === 0 || this.currentChunk === null || this.currentFile === null) {
        return;
    }

    var chunkVersionToAdd = this.rowsBalance > 0 ? this.currentChunk.versionB : this.currentChunk.versionA;

    for (var i = 0; i < Math.abs(this.rowsBalance); i++) {
        var row = new Row('', '#');
        chunkVersionToAdd.rows.push(row);
    }

    this.rowsBalance = 0;
};
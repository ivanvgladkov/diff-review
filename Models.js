function Diff()
{
    this.files = [];
}

function File()
{
    this.nameA = '';
    this.nameB = '';
    this.chunks = [];
}

function Chunk()
{
    this.versionA = new Version();
    this.versionB = new Version();
}

function Version()
{
    this.rows = [];
}

function Row(text, type)
{
    this.text = text;
    this.type = type;
}
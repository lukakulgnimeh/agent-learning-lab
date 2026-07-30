### Note the following:

It is important that the data is loaded correctly into the vector database.
The input PDF file is extracted as a single string, but the code node intentionally splits it into individual pages while also saving the metadata.
Therefore:
- The option **Data** must contain the **expression** "{{ $json.pageContent }}".
- Under **Options** add **Metadata** as property **Name** "document" and value **expression** "{{ $json.metadata }}".

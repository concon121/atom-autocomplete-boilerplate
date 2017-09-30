# atom-boto3-autocomplete

WORK IN PROGRESS. Autocomplete for the python boto3 package.

## Usage

In order to hint at which client you're using, this package is based on naming conventions.

The name of your boto3 client should reflect the name that the client function takes.

For example:

```
lex_models = boto3.client('lex-models')
```

NOTE: Hyphens should be replaced by underscores to fit in line with python variable naming conventions.

## Why?

Autocomplete typically doesnt work with boto3.  The implementation forces you to create a client via a factory function:

```
client = boto3.client('cloudformation')
```

This results in really loosly coupled code which is really easy to update, but you have no idea what client you will get until runtime.

## Should I use this package?

Probably not yet.  Boto3 is huge and I only just started this package.  Feel free to help me out and contribute some data!

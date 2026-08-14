# Inspector capability contract

The DetailView is derived from schema family/runtime metadata/capabilities.

Do not render a universal property form and hide random controls afterward.

Profiles:

```text
text-like
number
date-time
choice
signing
artifact
action
table
media
computed
visual
```

`dataBinding` determines connections UI:

```text
scalar     -> scalar binding controls
collection -> options/search/pagination/mapping
artifact   -> artifact/provider/reference controls
none       -> no generic DataSource panel
```

Assignment, lock and audit are distinct concepts.

Technical IDs/legacy aliases/transport implementation names belong to advanced/debug mode.

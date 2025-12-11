# @skriptfabrik/n8n-nodes-google-enhanced

[![NPM Version](https://img.shields.io/npm/v/@skriptfabrik/n8n-nodes-google-enhanced)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-google-enhanced)
[![NPM Downloads](https://img.shields.io/npm/dt/@skriptfabrik/n8n-nodes-google-enhanced)](https://www.npmjs.com/package/@skriptfabrik/n8n-nodes-google-enhanced)

> Enhanced Google community nodes for your [n8n](https://n8n.io/) workflows

This is an n8n community node. It lets you use [Google actions](https://docs.n8n.io/integrations/builtin/app-nodes/) with
service account credentials in your n8n workflows. Although the authentication method recommended by n8n is OAuth2, this
is not suitable in an environment where no user interaction is intended.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation)
[Operations](#operations)
[Credentials](#credentials)
[Compatibility](#compatibility)  
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community
nodes documentation.

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `@skriptfabrik/n8n-nodes-google-enhanced` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select
   **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes**
panel.

## Operations

It supports these operations with Service Account credentials:

- Create, delete, get, list, update Google Cloud Storage buckets and objects

## Credentials

You can use the built-in [Google credentials](https://docs.n8n.io/integrations/builtin/credentials/google/) to
authenticate with Google.

## Compatibility

Tested against n8n version 1.0+.

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [Google Cloud Storage API (v1)](https://cloud.google.com/storage/docs/json_api/v1)

#!/usr/bin/env bash
stripe listen --forward-to localhost:8080/billing/webhook

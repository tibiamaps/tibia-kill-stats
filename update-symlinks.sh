#!/usr/bin/env bash

date="$(date +'%Y-%m-%d')";
for world_path in data/*; do
	if [ "${world_path}" != "data/_global-total" ] && [ "${world_path}" != "data/_yesterday" ]; then
		ln --symbolic --force "${date}.json" "${world_path}/latest.json";
	fi;
done;

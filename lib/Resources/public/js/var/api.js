ag.api.Endpoint.register({
    "admin.v1/Settings.load": [
        "common.v1/String[]",
        "admin.v1/Setting[]"
    ],
    "admin.v1/Settings.save": [
        "admin.v1/Setting[]",
        "admin.v1/Setting[]"
    ]
});
ag.api.Object.register({
    "admin.v1/EntitySearchRequestObject": {
        "props": {
            "offset": {
                "type": "number",
                "minValue": 0,
                "default": 0
            },
            "limit": {
                "type": "number",
                "minValue": 1,
                "maxValue": 200,
                "default": 50
            },
            "orderBy": {
                "type": "string",
                "nullable": true,
                "default": "id"
            },
            "orderDir": {
                "type": "string",
                "values": [
                    "asc",
                    "desc"
                ],
                "nullable": true,
                "default": "asc"
            }
        }
    },
    "admin.v1/UserCapability": {
        "props": {
            "id": {
                "type": "number",
                "positive": true,
                "nullable": true
            },
            "name": {
                "type": "string"
            }
        }
    },
    "admin.v1/Setting": {
        "props": {
            "id": {
                "type": "string",
                "minLength": 3,
                "maxLength": 40
            },
            "value": {
                "type": "polymorphic",
                "nullable": true
            }
        }
    },
    "admin.v1/EntitySearchResponseObject": {
        "props": {
            "total": {
                "type": "number"
            },
            "result": {
                "type": "polymorphic",
                "nullable": true,
                "default": []
            }
        }
    },
    "admin.v1/UserRole": {
        "props": {
            "isSuper": {
                "type": "boolean"
            },
            "capabilities": {
                "type": "objectlist",
                "class": "admin.v1/UserCapability",
                "default": []
            },
            "id": {
                "type": "number",
                "positive": true,
                "nullable": true
            },
            "name": {
                "type": "string"
            }
        }
    }
});

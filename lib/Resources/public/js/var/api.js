ag.api.Endpoint.register({
    "admin.v1/Session.login": [
        "admin.v1/Login",
        "null"
    ],
    "admin.v1/Session.logout": [
        "null",
        "null"
    ]
});
ag.api.Object.register({
    "admin.v1/EntitySearchRequestObject": {
        "props": {
            "offset": {
                "type": "integer",
                "minValue": 0,
                "default": 0
            },
            "limit": {
                "type": "integer",
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
    "admin.v1/Login": {
        "props": {
            "email": {
                "type": "string"
            },
            "password": {
                "type": "string"
            }
        }
    },
    "admin.v1/DateTime": {
        "props": {
            "second": {
                "type": "integer",
                "minValue": 0,
                "maxValue": 59
            },
            "day": {
                "type": "integer",
                "minValue": 1,
                "maxValue": 31
            },
            "month": {
                "type": "integer",
                "minValue": 1,
                "maxValue": 12
            },
            "year": {
                "type": "integer",
                "minValue": 2000,
                "maxValue": 2100
            },
            "hour": {
                "type": "integer",
                "minValue": 0,
                "maxValue": 23
            },
            "minute": {
                "type": "integer",
                "minValue": 0,
                "maxValue": 59
            }
        }
    }
});

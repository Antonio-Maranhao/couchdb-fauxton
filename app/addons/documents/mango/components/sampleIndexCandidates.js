export default [
  {
    "index": {
      "ddoc": null,
      "name": "_all_docs",
      "type": "special",
      "def": {
        "fields": [
          {
            "_id": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_chosen",
      "not_composite"
    ]
  },
  {
    "index": {
      "ddoc": "_design/age",
      "name": "age",
      "type": "json",
      "partitioned": false,
      "def": {
        "fields": [
          {
            "age": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_chosen",
      "insufficient_index_range"
    ],
    "score": 1,
    "covering": false
  },
  {
    "index": {
      "ddoc": "_design/cedc01a027213706d7260b5e5b73c70b9233743a",
      "name": "cedc01a027213706d7260b5e5b73c70b9233743a",
      "type": "text",
      "partitioned": false,
      "def": {
        "default_analyzer": "keyword",
        "default_field": {},
        "selector": {},
        "fields": [],
        "index_array_lengths": true
      }
    },
    "reason": [
      "not_chosen",
      "not_composite"
    ]
  },
  {
    "index": {
      "ddoc": "_design/favorites",
      "name": "favorites",
      "type": "json",
      "partitioned": false,
      "def": {
        "fields": [
          {
            "favorites": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_usable",
      "missing_fields"
    ],
    "covering": false
  },
  {
    "index": {
      "ddoc": "_design/favorites_3",
      "name": "favorites_3",
      "type": "json",
      "partitioned": false,
      "def": {
        "fields": [
          {
            "favorites.3": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_usable",
      "missing_fields"
    ],
    "covering": false
  },
  {
    "index": {
      "ddoc": "_design/location",
      "name": "location",
      "type": "json",
      "partitioned": false,
      "def": {
        "fields": [
          {
            "location.state": "asc"
          },
          {
            "location.city": "asc"
          },
          {
            "location.address.street": "asc"
          },
          {
            "location.address.number": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_usable",
      "missing_fields"
    ],
    "covering": false
  },
  {
    "index": {
      "ddoc": "_design/manager",
      "name": "manager",
      "type": "json",
      "partitioned": false,
      "def": {
        "fields": [
          {
            "manager": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_chosen",
      "insufficient_index_range"
    ],
    "score": 2,
    "covering": false
  },
  {
    "index": {
      "ddoc": "_design/name",
      "name": "name",
      "type": "json",
      "partitioned": false,
      "def": {
        "fields": [
          {
            "name.last": "asc"
          },
          {
            "name.first": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_usable",
      "missing_fields"
    ],
    "covering": false
  },
  {
    "index": {
      "ddoc": "_design/ordered",
      "name": "ordered",
      "type": "json",
      "partitioned": false,
      "def": {
        "fields": [
          {
            "ordered": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_usable",
      "missing_fields"
    ],
    "covering": false
  },
  {
    "index": {
      "ddoc": "_design/twitter",
      "name": "twitter",
      "type": "json",
      "partitioned": false,
      "def": {
        "fields": [
          {
            "twitter": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_usable",
      "missing_fields"
    ],
    "covering": false
  },
  {
    "index": {
      "ddoc": "_design/user_id",
      "name": "user_id",
      "type": "json",
      "partitioned": false,
      "def": {
        "fields": [
          {
            "user_id": "asc"
          }
        ]
      }
    },
    "reason": [
      "not_usable",
      "missing_fields"
    ],
    "covering": false
  }
];

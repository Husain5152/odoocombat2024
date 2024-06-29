{
    'name': 'Furniture Rental Website Sale',
    'version': '1.0',
    'summary': 'A module to manage furniture rental services.',
    'category': 'Rental',
    'author': 'Husain/Vrajesh/Massom',
    'depends': ['website_sale', 'furniture_rental'],
    'data': [
        'views/templates.xml',
    ],

    'assets': {
        'web.assets_frontend': [
            'furniture_rental_website/static/src/js/publicwidget.js'
        ],
    },

    'application': True,
}
{
    'name': 'Furniture Rental Website Sale',
    'version': '1.0',
    'summary': 'A module to manage furniture rental services.',
    'category': 'Rental',
    'author': 'Husain/Vrajesh/Massom',
    'depends': [
        'website_sale', 'furniture_rental'
    ],
    'data': [
        # 'views/views.xml',
        'views/templates.xml',
    ],

    'assets': {
        'web.assets_frontend': [
            # 'furniture_rental_website/static/src/js/website_sale_util_new.js'
        ],
    },

    'application': True,
}
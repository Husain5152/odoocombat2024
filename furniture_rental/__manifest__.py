{
    'name': 'Furniture Rental',
    'version': '1.0',
    'summary': 'A module to manage furniture rental services.',
    'category': 'Rental',
    'author': 'Husain/Vrajesh/Massom',
    'depends': ['base', 'product' ,'website', 'sale_management', 'payment', 'stock', 'web'],
    'data': [
        'views/rental.xml',
        'views/product_template.xml',
        'views/customer.xml',
        'views/dashboard.xml',
    ],
    'application': True,
    'assets': {
        'web.assets_backend': [
            'furniture_rental/static/src/scss/dashboard.scss',
        ],
        }
}
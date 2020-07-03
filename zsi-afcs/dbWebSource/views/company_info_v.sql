CREATE VIEW dbo.company_info_v
AS
SELECT        dbo.banks.bank_name, dbo.cities.city_name, dbo.company_info.*
FROM            dbo.company_info INNER JOIN
                         dbo.cities ON dbo.company_info.city_id = dbo.cities.city_id INNER JOIN
                         dbo.banks ON dbo.company_info.bank_id = dbo.banks.bank_id

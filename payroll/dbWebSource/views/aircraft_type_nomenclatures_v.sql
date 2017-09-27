
CREATE VIEW [dbo].[aircraft_type_nomenclatures_v]
AS
SELECT        dbo.aircraft_type_nomenclatures.*, dbo.item_codes_v.part_no, dbo.item_codes_v.national_stock_no, dbo.item_codes_v.item_name, dbo.aircraft_type.aircraft_type
              ,dbo.countAircraftTypeItems(null, aircraft_type_nomenclature_id) countSubComponents
FROM            dbo.aircraft_type_nomenclatures INNER JOIN
                         dbo.aircraft_type ON dbo.aircraft_type_nomenclatures.aircraft_type_id = dbo.aircraft_type.aircraft_type_id INNER JOIN
                         dbo.item_codes_v ON dbo.aircraft_type_nomenclatures.item_code_id = dbo.item_codes_v.item_code_id


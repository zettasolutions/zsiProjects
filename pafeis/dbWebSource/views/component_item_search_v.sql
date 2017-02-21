CREATE VIEW dbo.component_item_search_v
AS
SELECT        dbo.items.serial_no, dbo.item_codes.part_no, dbo.item_codes.national_stock_no, dbo.item_codes.item_name, dbo.item_codes.critical_level, dbo.item_types.item_type_name, dbo.items.time_since_new, 
                         dbo.items.time_before_overhaul, dbo.items.time_since_overhaul, dbo.items.remaining_time_hr, dbo.items.remaining_time_min, dbo.items.date_delivered, dbo.items.date_issued, 
                         dbo.getOrganizationName(dbo.items_inv.organization_id) AS organization_name
FROM            dbo.items INNER JOIN
                         dbo.item_types INNER JOIN
                         dbo.item_codes INNER JOIN
                         dbo.items_inv ON dbo.item_codes.item_code_id = dbo.items_inv.item_code_id ON dbo.item_types.item_type_id = dbo.item_codes.item_type_id ON dbo.items.item_inv_id = dbo.items_inv.item_inv_id
WHERE        (dbo.item_types.item_cat_id = 23) AND (dbo.item_codes.is_active = 'Y') AND (dbo.item_types.is_active = N'Y')

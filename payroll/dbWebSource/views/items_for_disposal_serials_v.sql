CREATE VIEW dbo.items_for_disposal_v
AS
SELECT        item_id, serial_no, manufacturer_id, manufacturer_name, dealer_id, dealer_name, supply_source_id, supply_source_name, time_since_new, time_before_overhaul, time_since_overhaul, remaining_time, date_delivered, 
                         aircraft_info_id, date_issued, status_id, no_repairs AS part_no, no_overhauls AS national_stock_no, item_inv_id AS item_name, parent_item_id AS reorder_level
FROM            dbo.items_v
WHERE        (status_id = 60)

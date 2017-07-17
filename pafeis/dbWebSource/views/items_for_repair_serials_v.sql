CREATE VIEW dbo.items_for_repair_serials_v
AS
SELECT        item_id, serial_no, manufacturer_id, manufacturer_name, dealer_id, dealer_name, supply_source_id, supply_source_name, time_since_new, time_before_overhaul, time_since_overhaul, remaining_time, date_delivered, 
                         aircraft_info_id, date_issued, status_id, no_repairs, no_overhauls, item_inv_id, parent_item_id, item_status
FROM            dbo.items_v
WHERE        (item_status = 'FOR REPAIR')

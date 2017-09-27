CREATE VIEW dbo.good_items_v
AS
SELECT        item_id, item_code_id, item_name, part_no, national_stock_no, serial_no, manufacturer_id, manufacturer_name, dealer_id, dealer_name, supply_source_id, supply_source_name, time_since_new, 
                         time_before_overhaul, time_since_overhaul, remaining_time_hr, remaining_time_min, date_delivered, aircraft_info_id, aircraft_name, date_issued, status_id
FROM            dbo.items_v
WHERE        (ISNULL(aircraft_info_id, 0) = 0) AND (status_id = 23)

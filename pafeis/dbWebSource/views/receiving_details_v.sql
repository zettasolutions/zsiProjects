CREATE VIEW dbo.receiving_details_v
AS
SELECT        dbo.receiving_details.receiving_detail_id, dbo.receiving_details.receiving_id, dbo.receiving_details.item_id, dbo.receiving_details.serial_no, dbo.receiving_details.unit_of_measure_id, 
                         dbo.receiving_details.quantity, dbo.receiving_details.created_by, dbo.receiving_details.created_date, dbo.receiving_details.updated_by, dbo.receiving_details.updated_date, dbo.receiving_details.remarks, 
                         dbo.receiving_routings_current_v.role_id
FROM            dbo.receiving_details INNER JOIN
                         dbo.receiving_routings_current_v ON dbo.receiving_details.receiving_id = dbo.receiving_routings_current_v.doc_id

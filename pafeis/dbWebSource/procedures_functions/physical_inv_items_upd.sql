
CREATE PROCEDURE [dbo].[physical_inv_items_upd] (
  @physical_inv_id INT
 ,@user_id     INT
)
AS
BEGIN
SET NOCOUNT ON

      INSERT INTO dbo.physical_inv_history (physical_inv_id, item_inv_id, prev_qty, pi_qty)
	  SELECT physical_inv_id, item_inv_id, dbo.getItemInvQty(item_inv_id), quantity 
	    FROM physical_inv_details_sum_qty_v 
	   WHERE physical_inv_id = @physical_inv_id;

       UPDATE a  
		   SET stock_qty = b.quantity 
		   FROM dbo.items_inv a INNER JOIN dbo.physical_inv_details_sum_qty_v b
		   ON a.item_inv_id = b.item_inv_id 
		   WHERE b.physical_inv_id = @physical_inv_id;

      DELETE FROM dbo.warehouse_bins WHERE item_inv_id IN (SELECT item_inv_id FROM dbo.physical_inv_details_v
		   WHERE physical_inv_id = @physical_inv_id);

      INSERT INTO dbo.warehouse_bins (item_inv_id, bin, quantity) 
	       SELECT item_inv_id, bin, quantity FROM dbo.physical_inv_details_v
		   WHERE physical_inv_id = @physical_inv_id;

      INSERT INTO items (item_code_id, serial_no, item_inv_id, status_id, created_by, created_date) 
	       SELECT item_code_id, serial_no, item_inv_id, status_id, created_by, created_date
		     FROM dbo.physical_inv_sn_v 
			WHERE serial_no NOT IN (SELECT serial_no FROM items)
			and physical_inv_id=@physical_inv_id
	   

END;




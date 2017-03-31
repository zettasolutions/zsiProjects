
CREATE PROCEDURE [dbo].[physical_inv_items_upd] (
  @physical_inv_id INT
 ,@user_id     INT
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @id int=0;
DECLARE @is_type VARCHAR(20)=NULL;
DECLARE @aircraft_id INT=NULL;
DECLARE @status_id INT=NULL;


       INSERT INTO items_inv (item_code_id, warehouse_id, bin_id)
	   SELECT item_code_id, warehouse_id, bin FROM physical_inv_details_v
	   WHERE physical_inv_id = @physical_inv_id;

       UPDATE a  
		   SET stock_qty = a.stock_qty + b.pi_qty 
		   FROM dbo.items_inv a INNER JOIN dbo.physical_inv_details_sum_qty_v b
		   ON a.item_code_id = b.item_code_id 
		   WHERE b.physical_inv_id = @physical_inv_id;




END;



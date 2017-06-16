

CREATE PROCEDURE [dbo].[adjustment_item_upd]
(
    @adjustment_id INT
)
AS

BEGIN
-- Update Process
   DECLARE @tt table (
     id int identity
	,adjustment_type char(1)
	,item_code_id int
	,item_inv_id int
	,serial_no nvarchar(50)
	,item_status_id int
	,adjustment_qty  decimal(10,2)
   )
   DECLARE @tt_count INT=0
   DECLARE @id int = 1
   DECLARE @adjustment_type char(1)
   DECLARE @item_code_id INT
   DECLARE @item_inv_id INT
   DECLARE @serial_no NVARCHAR(50)
   DECLARE @item_status_id int
   DECLARE @adjustment_qty decimal(10,2)
   DECLARE @serials INT

   INSERT INTO @tt 
   (adjustment_type
   ,item_code_id
   ,item_inv_id
   ,serial_no
   ,item_status_id
   ,adjustment_qty)
   SELECT 
    adjustment_type
   ,item_code_id
   ,item_inv_id
   ,serial_no
   ,item_status_id
   ,adjustment_qty
   FROM dbo.adjustment_details_v
   WHERE adjustment_id = @adjustment_id;

   SELECT @tt_count=COUNT(*) FROM @tt;
   WHILE @tt_count < @id
   BEGIN
      SELECT @adjustment_type=adjustment_type 
	        ,@item_code_id	= item_code_id
	        ,@item_inv_id	= item_inv_id
			,@serial_no		= serial_no
			,@item_status_id= item_status_id
			,@adjustment_qty= adjustment_qty
	  FROM @tt where id = @id;

	  IF @adjustment_type='D'
	  BEGIN
	     UPDATE items_inv SET stock_qty = stock_qty-@adjustment_qty WHERE item_inv_id = @item_inv_id 
		 IF ISNULL(@serial_no,'') <> '' 
		    UPDATE items SET status_id = @item_status_id WHERE serial_no =@serial_no;
      END
	  ELSE
	     UPDATE items_inv SET stock_qty = stock_qty+@adjustment_qty WHERE item_inv_id = @item_inv_id 
		 IF ISNULL(@serial_no,'') <> '' 
		 BEGIN
		    SELECT @serials=count(*) FROM items WHERE serial_no = @serial_no
			IF @serials > 0
		       UPDATE items SET status_id = @item_status_id WHERE serial_no=@serial_no;
			ELSE
			   INSERT INTO items (item_inv_id, item_code_id, serial_no, status_id) VALUES (@item_inv_id, @item_code_id, @serial_no, @item_status_id)
        END
   END




END





CREATE PROCEDURE [dbo].[receiving_items_upd] (
  @receiving_id INT
 ,@user_id      INT
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @tt TABLE (
   id                           INT IDENTITY
  ,receiving_detail_id			INT
  ,procurement_detail_id        INT
  ,receiving_id					INT
  ,item_code_id					INT
  ,serial_no					VARCHAR(50)
  ,unit_of_measure_id			INT
  ,quantity						INT
  ,warehouse_id	                INT
  ,doc_date                     date
  ,procurement_id               int

)
DECLARE @rec_count  int
DECLARE @count  int=0;
DECLARE @item_code_id				INT
DECLARE @serial_no					VARCHAR(50)
DECLARE @unit_of_measure_id			INT
DECLARE @quantity					INT
DECLARE @warehouse_id				INT
DECLARE @item_inv_id				INT
DECLARE @procurement_detail_id      INT
DECLARE @procurement_id             INT
DECLARE @doc_date                   DATE

INSERT INTO @tt
SELECT  receiving_detail_id		
       ,procurement_detail_id
	   ,receiving_id				
	   ,item_code_id					
	   ,serial_no				
	   ,unit_of_measure_id		
	   ,quantity					
	   ,warehouse_id 
	   ,doc_date
	   ,procurement_id
  FROM dbo.receiving_details_v;

SELECT @rec_count = COUNT(*) FROM @tt;
WHILE @count < @rec_count 
	BEGIN
		SELECT TOP 1  @item_code_id					=	item_code_id							
					 ,@serial_no					=	serial_no					
					 ,@unit_of_measure_id			=	unit_of_measure_id			
					 ,@quantity						=	quantity					
					 ,@warehouse_id	                =	warehouse_id	
					 ,@procurement_detail_id        =   procurement_detail_id
					 ,@doc_date                     =   doc_date
					 ,@procurement_id               =   procurement_id
		FROM @tt WHERE id > @count;

		IF ISNULL(@procurement_detail_id,0) <> 0 
		   UPDATE dbo.procurement_detail SET total_delivered_quantity = total_delivered_quantity + @quantity,
		                                     balance_quantity = balance_quantity - @quantity 
									   WHERE procurement_detail_id =  @procurement_detail_id;

        IF dbo.sumProcurementBalanceQty(@procurement_id) = 0 
		   UPDATE dbo.procurement set actual_delivery_date = @doc_date 
		                             ,status_id = 19 
		   WHERE procurement_id = @procurement_id;

   	    IF (SELECT COUNT(*) FROM dbo.items_inv WHERE item_code_id = @item_code_id AND warehouse_id=@warehouse_id) = 0
			BEGIN
				INSERT INTO dbo.items_inv (item_code_id, warehouse_id, stock_qty, created_by, created_date)
					   VALUES (@item_code_id, @warehouse_id, @quantity, @user_id, GETDATE())
				SET @item_inv_id = @@IDENTITY 
			END
		ELSE
			BEGIN
			   UPDATE dbo.items_inv 
			   SET stock_qty = stock_qty + @quantity
			 WHERE item_code_id = @item_code_id
			   AND warehouse_id=@warehouse_id;

			   SELECT @item_inv_id = item_inv_id FROM dbo.items_inv 
				WHERE item_code_id = @item_code_id
			   AND warehouse_id=@warehouse_id;
			END;

		IF (SELECT COUNT(*) FROM dbo.items WHERE serial_no = @serial_no) = 0
		   INSERT INTO dbo.items (item_code_id, item_inv_id, serial_no,  status_id, created_by, created_date)
		          VALUES (@item_code_id,@item_inv_id, @serial_no,  23, @user_id, GETDATE());
	    ELSE
		   UPDATE items SET item_inv_id=@item_inv_id WHERE serial_no=@serial_no;

		SET @count = @count + 1;
	END;
END;

select * from statuses
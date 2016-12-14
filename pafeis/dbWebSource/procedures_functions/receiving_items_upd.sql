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
  ,receiving_id					INT
  ,item_id						INT
  ,serial_no					VARCHAR(50)
  ,unit_of_measure_id			INT
  ,quantity						INT
  ,receiving_organization_id	INT
)
DECLARE @rec_count  int
DECLARE @count  int=0;
DECLARE @item_id					INT
DECLARE @serial_no					VARCHAR(50)
DECLARE @unit_of_measure_id			INT
DECLARE @quantity					INT
DECLARE @receiving_organization_id	INT

INSERT INTO @tt
SELECT  receiving_detail_id		
	   ,receiving_id				
	   ,item_id					
	   ,serial_no				
	   ,unit_of_measure_id		
	   ,quantity					
	   ,receiving_organization_id 
  FROM dbo.receiving_details_v;

SELECT @rec_count = COUNT(*) FROM @tt;
WHILE @count < @rec_count 
	BEGIN
		SELECT TOP 1  @item_id						=	item_id							
					 ,@serial_no					=	serial_no					
					 ,@unit_of_measure_id			=	unit_of_measure_id			
					 ,@quantity						=	quantity					
					 ,@receiving_organization_id	=	receiving_organization_id	
		FROM @tt WHERE id > @count;
		IF (SELECT COUNT(*) FROM dbo.items WHERE serial_no = @serial_no) = 0
		   INSERT INTO dbo.items (item_code_id, serial_no, organization_id, created_by, created_date)
		          VALUES (@item_id, @serial_no, @receiving_organization_id, @user_id, GETDATE());
        ELSE
		   UPDATE dbo.items SET organization_id = @receiving_organization_id WHERE serial_no = @serial_no;    
	

        UPDATE dbo.items_inv 
		   SET stock_qty = stock_qty + @quantity
		 WHERE item_code_id = @item_id;

		IF (SELECT COUNT(*) FROM dbo.items_inv WHERE item_code_id = @item_id) = 0
			INSERT INTO dbo.items_inv (item_code_id, organization_id, stock_qty, created_by, created_date)
				   VALUES (@item_id, @receiving_organization_id, @quantity, @user_id, GETDATE())
		   
		SET @count = @count + 1;
	END;
END;

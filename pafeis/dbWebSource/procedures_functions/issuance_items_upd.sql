
CREATE PROCEDURE [dbo].[issuance_items_upd] (
  @issuance_id INT
 ,@user_id     INT
)
AS
BEGIN
SET NOCOUNT ON
DECLARE @id int=0;
DECLARE @is_type VARCHAR(20)=NULL;
DECLARE @aircraft_id INT=NULL;
DECLARE @status_id INT=NULL;

        UPDATE a  
		   SET stock_qty = a.stock_qty - b.quantity 
		   FROM dbo.items_inv a INNER JOIN dbo.issuance_details_v b
		   ON a.item_inv_id = b.item_inv_id 
		   and b.issuance_id = @issuance_id;

SELECT @is_type = issuance_type, @aircraft_id=aircraft_id,@status_id=IIF(@is_type='DISPOSAL',27,status_id)  
  FROM dbo.issuances WHERE issuance_id=@issuance_id;

        UPDATE a
		  SET item_inv_id = NULL
		     ,status_id = @status_id
			 ,aircraft_info_id=@aircraft_id
			 ,updated_by=@user_id
			 ,updated_date=GETDATE()
		 FROM dbo.items a INNER JOIN dbo.issuance_details_v b
		   ON a.serial_no = b.serial_no
		  AND b.issuance_id = @issuance_id;

	IF @is_type IN ('WAREHOUSE','MAINTENANCE','DIRECTIVE')
	BEGIN
		INSERT INTO dbo.receiving (    
			 doc_no			
			,doc_date		
			,issuance_warehouse_id
			,warehouse_id
			,status_id
			,status_remarks
			,receiving_type
			,issuance_organization_id
			,created_by
			,created_date
			)
		SELECT 
			 issuance_no
			,issued_date			
			,warehouse_id
			,transfer_warehouse_id
			,dbo.getPageTopPPA_Id(70)
			,status_remarks
			,issuance_type
			,issued_to_organization_id
		   ,@user_id
		   ,GETDATE()
		   FROM dbo.issuances_v
		   where issuance_id = @issuance_id;

		   SELECT @id=doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY;

	   INSERT INTO dbo.receiving_details (
			 receiving_id 
			,item_code_id
			,serial_no
			,unit_of_measure_id
			,quantity
			,remarks
			,created_by
			,created_date
			)
		SELECT 
			@id 
		   ,item_code_id
		   ,serial_no
		   ,unit_of_measure_id	
		   ,quantity
		   ,remarks
		   ,@user_id
		   ,GETDATE()
		FROM issuance_details_v
		WHERE issuance_id=@issuance_id
	END;

END;
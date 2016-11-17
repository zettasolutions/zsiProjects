
CREATE PROCEDURE [dbo].[receiving_upd]
(
    @tt    receiving_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
    SET 
		 receiving_no		        = b.receiving_no
	    ,invoice_no                 = b.invoice_no     
     	,invoice_date				= b.invoice_date	
	    ,dr_no						= b.dr_no			
	    ,dr_date					= b.dr_date		
	    ,dealer_id					= b.dealer_id		
	    ,receiving_organization_id	= b.receiving_organization_id
		,authority_id				= b.authority_id
		,transfer_organization_id	= b.transfer_organization_id
		,stock_transfer_no          = b.stock_transfer_no
		,received_by				= b.received_by
		,received_date				= b.received_date
		,status_remarks				= b.status_remarks
		,updated_by					= @user_id
        ,updated_date				= GETDATE()
    FROM dbo.receiving a INNER JOIN @tt b
    ON a.receiving_id = b.receiving_id
    WHERE (
			
			isnull(a.receiving_no,0)	    <> isnull(b.receiving_no,0)  
		OR	isnull(a.invoice_no,'')			<> isnull(b.invoice_no,'') 
		OR	isnull(a.invoice_date,'')		<> isnull(b.invoice_date,'') 
		OR	isnull(a.dr_no,0)				<> isnull(b.dr_no,0) 
		OR	isnull(a.dr_date,'')			<> isnull(b.dr_date,'') 
		OR	isnull(a.dealer_id,0)			<> isnull(b.dealer_id,0) 
		OR	isnull(a.receiving_organization_id,0)	<> isnull(b.receiving_organization_id,0) 
		OR	isnull(a.authority_id,0)		<> isnull(b.authority_id,0) 
		OR	isnull(a.transfer_organization_id,0)	<> isnull(b.transfer_organization_id,0) 
		OR	isnull(a.stock_transfer_no,0)	<> isnull(b.stock_transfer_no,0) 
		OR	isnull(a.received_by,'')		<> isnull(b.received_by,'') 
		OR	isnull(a.received_date,0)		<> isnull(b.received_date,0) 
		OR	isnull(a.status_remarks,'')		<> isnull(b.status_remarks,'') 
	)
	   
-- Insert Process
    INSERT INTO dbo.receiving (    
		 receiving_no
		,invoice_no     
		,invoice_date	
		,dr_no			
		,dr_date		
		,dealer_id		
		,receiving_organization_id
		,authority_id
		,transfer_organization_id
		,stock_transfer_no
		,received_by
		,received_date
		,status_remarks
		,created_by
		,created_date
        )
    SELECT 
         receiving_no
		,invoice_no     
		,invoice_date	
		,dr_no			
		,dr_date		
		,dealer_id	
		,receiving_organization_id
		,authority_id
		,transfer_organization_id
		,stock_transfer_no
		,received_by
		,received_date
		,status_remarks
	   ,@user_id
	   ,GETDATE()
    FROM @tt
    WHERE receiving_id IS NULL
	 AND authority_id IS NOT NULL;

	RETURN @@identity;
END


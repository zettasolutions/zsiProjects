
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
	    ,doc_no						= b.doc_no			
	    ,doc_date					= b.doc_date		
	    ,dealer_id					= b.dealer_id		
	    ,receiving_organization_id	= b.receiving_organization_id
		,transfer_organization_id	= b.transfer_organization_id
		,aircraft_id                = b.aircraft_id
		,received_by				= b.received_by
		,received_date				= b.received_date
		,status_id                  = b.status_id
		,status_remarks				= b.status_remarks
		,updated_by					= @user_id
        ,updated_date				= GETDATE()
    FROM dbo.receiving a INNER JOIN @tt b
    ON a.receiving_id = b.receiving_id
    WHERE (
			
			isnull(a.receiving_no,0)	    <> isnull(b.receiving_no,0)  
		OR	isnull(a.doc_no,0)				<> isnull(b.doc_no,0) 
		OR	isnull(a.doc_date,'')			<> isnull(b.doc_date,'') 
		OR	isnull(a.dealer_id,0)			<> isnull(b.dealer_id,0) 
		OR	isnull(a.receiving_organization_id,0)	<> isnull(b.receiving_organization_id,0) 
		OR	isnull(a.transfer_organization_id,0)	<> isnull(b.transfer_organization_id,0) 
		OR	isnull(a.aircraft_id,0)	        <> isnull(b.aircraft_id,0) 
		OR	isnull(a.received_by,'')		<> isnull(b.received_by,'') 
		OR	isnull(a.received_date,0)		<> isnull(b.received_date,0) 
		OR	isnull(a.status_id,0)		    <> isnull(b.status_id,0) 
		OR	isnull(a.status_remarks,'')		<> isnull(b.status_remarks,'') 
	)
	   
-- Insert Process
DECLARE @receiving_id INT;
SET @receiving_id = null;

    INSERT INTO dbo.receiving (    
		 receiving_no
		,doc_no			
		,doc_date		
		,dealer_id		
		,receiving_organization_id
		,transfer_organization_id
		,aircraft_id
		,received_by
		,received_date
		,status_id
		,status_remarks
		,created_by
		,created_date
        )
    SELECT 
         receiving_no
		,doc_no			
		,doc_date		
		,dealer_id	
		,receiving_organization_id
		,transfer_organization_id
		,aircraft_id
		,received_by
		,received_date
		,status_id
		,status_remarks
	   ,@user_id
	   ,GETDATE()
    FROM @tt
    WHERE receiving_id IS NULL
	and doc_no IS NOT NULL

	RETURN (SELECT doc_id FROM doc_routings WHERE doc_routing_id = @@IDENTITY);
END


CREATE PROCEDURE [dbo].[suppliers_upd]
(
    @tt    suppliers_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  supplier_name  = b.supplier_name
			,contact_name   = b.contact_name
			,contact_no	    = b.contact_no
			,is_active	    = b.is_active
            ,updated_by     = @user_id
            ,updated_date   = GETDATE()
     FROM dbo.suppliers a INNER JOIN @tt b
        ON a.supplier_id = b.supplier_id 
       WHERE (
				isnull(a.supplier_name,'') <> isnull(b.supplier_name,'')   
			OR	isnull(a.contact_name,'') <> isnull(b.contact_name,'')   
			OR	isnull(a.contact_no,'') <> isnull(b.contact_no,'')   
			OR	isnull(a.is_active,'') <> isnull(b.is_active,'')   
	   )

-- Insert Process

    INSERT INTO suppliers (
         supplier_name
		,contact_name 
		,contact_no	  
		,is_active
        ,created_by
        ,created_date
        )
    SELECT 
        supplier_name
	   ,contact_name 
	   ,contact_no	  
	   ,is_active
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE supplier_id IS NULL
	  AND supplier_name IS NOT NULL
	  AND contact_name IS NOT NULL
	  AND contact_no IS NOT NULL
	  AND is_active IS NOT NULL;
END




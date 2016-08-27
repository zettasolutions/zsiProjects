CREATE PROCEDURE [dbo].[adjustments_ref_upd]
(
    @tt   adjustments_ref_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET  adjmt_desc		=   b.adjmt_desc
			,posted			=   b.posted
	        ,updated_by		=   @user_id
            ,updated_date	=   GETDATE()
     FROM dbo.adjustments_ref a INNER JOIN @tt b
        ON a.adjmt_id = b.adjmt_id 
       WHERE (
				isnull(a.adjmt_desc,'') <> isnull(b.adjmt_desc,'')   
			OR	isnull(a.posted,'')     <> isnull(b.posted,'')   
	   )

-- Insert Process

    INSERT INTO adjustments_ref (
         adjmt_desc	
	    ,posted		
		,created_by
        ,created_date
        )
    SELECT 
         adjmt_desc	
	    ,posted	
       ,@user_id
       ,GETDATE()
    FROM @tt
    WHERE adjmt_id IS NULL
END







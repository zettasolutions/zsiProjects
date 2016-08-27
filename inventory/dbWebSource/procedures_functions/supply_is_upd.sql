
CREATE PROCEDURE [dbo].[supply_is_upd]
(
    @tt    supply_is_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET 
			 is_no					= b.is_no
			,is_date				= b.is_date
			,store_loc_id			= b.store_loc_id
			,posted					= b.posted
			,updated_by				= @user_id
            ,updated_date			= GETDATE()
     FROM dbo.supply_is a INNER JOIN @tt b
        ON a.supply_is_id = b.supply_is_id 
       WHERE (
				isnull(a.is_no,'')					<> isnull(b.is_no,'')   
			OR	isnull(a.is_date,'')				<> isnull(b.is_date,'')   
			OR	isnull(a.store_loc_id,'')			<> isnull(b.store_loc_id,'') 
			OR	isnull(a.posted,'')					<> isnull(b.posted,'') 
			
	   )

 

-- Insert Process

    INSERT INTO supply_is(
       
		 is_no
		,is_date 
		,store_loc_id  
		,posted
        ,created_by
        ,created_date
		
        )
    SELECT 
       
		 is_no
		,is_date 
		,store_loc_id  
		,posted		
		,@user_id  
		,GETDATE()
       
       
    FROM @tt
    WHERE supply_is_id IS NULL
	 
END




CREATE PROCEDURE [dbo].[excel_upload_upd]
(
    @tt   excel_uploads_tt READONLY
   ,@user_id int
)
AS

BEGIN
-- Update Process
    UPDATE a 
        SET	 
			 seq_no				=	b.seq_no
			,temp_table			=	b.temp_table
			,excel_column_range	=	b.excel_column_range
			,load_name			=	b.load_name
			,redirect_page		=	b.redirect_page
			,insert_proc		=	b.insert_proc
			,updated_by			=	@user_id
            ,updated_date		=	GETDATE()
		FROM dbo.excel_uploads a INNER JOIN @tt b
        ON a.id = b.id 
		WHERE (
				--isnull(a.id,0)		     <> isnull(b.id,0)   
		   	 isnull(a.seq_no,0)		 <> isnull(b.seq_no,0)   
			OR	isnull(a.temp_table,'')		 <> isnull(b.temp_table,'')  		    
			OR	isnull(a.excel_column_range,'')	 <> isnull(b.excel_column_range,'')   
			OR	isnull(a.load_name,'')	 <> isnull(b.load_name,'')  		    
			OR	isnull(a.redirect_page,'')	 <> isnull(b.redirect_page,'')   
			OR	isnull(a.insert_proc,'')	 <> isnull(b.insert_proc,'')      
			  )

-- Insert Process

    INSERT INTO dbo.excel_uploads(
						
		 seq_no				
		,temp_table			
		,excel_column_range	
		,load_name			
		,redirect_page		
		,insert_proc
		,created_by
		,created_date
					
        )
    SELECT 
							
		 seq_no				
		 ,temp_table			
		 ,excel_column_range	
		 ,load_name			
		 ,redirect_page		
		 ,insert_proc		
		 ,@user_id  
		 ,GETDATE()
    FROM @tt
    WHERE id IS NULL 
	--AND id IS NOT NULL
	/*AND last_name IS NOT NULL
	AND first_name IS NOT NULL;*/
END



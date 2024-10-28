// lib/bulkData.js
const esClient = require('./elasticsearch');

const books = [
  { title: 'Đắc Nhân Tâm', author: 'Dale Carnegie', description: 'Cuốn sách giúp phát triển các kỹ năng giao tiếp, tạo dựng mối quan hệ và thuyết phục người khác.', published_date: '1936-10-01' },
  { title: 'Tôi Thấy Hoa Vàng Trên Cỏ Xanh', author: 'Nguyễn Nhật Ánh', description: 'Câu chuyện về tuổi thơ, tình bạn và những mơ mộng của tuổi học trò.', published_date: '2010-06-01' },
  { title: 'Người Nam Châm', author: 'Jack Canfield', description: 'Truyền cảm hứng về cách thu hút thành công qua luật hấp dẫn.', published_date: '2009-04-15' },
  { title: 'Nhà Giả Kim', author: 'Paulo Coelho', description: 'Hành trình tìm kiếm kho báu và triết lý sống.', published_date: '1988-04-15' },
  { title: 'Cà Phê Cùng Tony', author: 'Tony Buổi Sáng', description: 'Bài viết chia sẻ về lối sống tích cực của giới trẻ hiện đại.', published_date: '2015-01-01' },
  { title: 'Muôn Kiếp Nhân Sinh', author: 'Nguyên Phong', description: 'Hành trình luân hồi và triết lý sống của con người qua các kiếp sống.', published_date: '2020-05-05' },
  { title: 'Sống Như Một Nhà Hiền Triết', author: 'Robin Sharma', description: 'Những nguyên tắc để sống một cuộc đời thịnh vượng.', published_date: '2004-02-12' },
  { title: 'Hành Trình Về Phương Đông', author: 'Baird T. Spalding', description: 'Cuộc hành trình tìm kiếm sự thật về tâm linh phương Đông.', published_date: '1924-01-01' },
  { title: 'Cho Tôi Xin Một Vé Đi Tuổi Thơ', author: 'Nguyễn Nhật Ánh', description: 'Câu chuyện về tuổi thơ và tình bạn.', published_date: '2008-07-01' },
  { title: 'Quẳng Gánh Lo Đi Và Vui Sống', author: 'Dale Carnegie', description: 'Giúp con người loại bỏ lo lắng và sống tích cực.', published_date: '1948-12-01' },

  { title: 'Trên Đường Băng', author: 'Tony Buổi Sáng', description: 'Những bài học về kỹ năng và kinh nghiệm trong cuộc sống.', published_date: '2015-01-01' },
  { title: 'Hạnh Phúc Trong Tầm Tay', author: 'Dale Carnegie', description: 'Cách tìm kiếm hạnh phúc và vượt qua khó khăn.', published_date: '1937-12-01' },
  { title: 'Bí Mật Tư Duy Triệu Phú', author: 'T. Harv Eker', description: 'Cách thức tư duy của những người thành công và giàu có.', published_date: '2005-03-01' },
  { title: 'Con Chim Xanh Biếc Bay Về', author: 'Nguyễn Nhật Ánh', description: 'Một câu chuyện nhẹ nhàng về tình yêu tuổi trẻ.', published_date: '2020-07-01' },
  { title: 'Cây Chuối Non Đi Giày Xanh', author: 'Nguyễn Nhật Ánh', description: 'Câu chuyện về một thời thơ ấu và tuổi mới lớn.', published_date: '2019-05-01' },
  { title: 'Dế Mèn Phiêu Lưu Ký', author: 'Tô Hoài', description: 'Cuộc phiêu lưu của chú dế mèn và các bài học cuộc sống.', published_date: '1941-01-01' },
  { title: 'Lão Hạc', author: 'Nam Cao', description: 'Một tác phẩm kinh điển về sự nghèo khó và lòng tự trọng.', published_date: '1943-01-01' },
  { title: 'Chiếc Lược Ngà', author: 'Nguyễn Quang Sáng', description: 'Câu chuyện về tình cảm gia đình trong chiến tranh.', published_date: '1966-01-01' },
  { title: 'Số Đỏ', author: 'Vũ Trọng Phụng', description: 'Một tác phẩm hài hước phê phán xã hội Việt Nam thập niên 1930.', published_date: '1936-01-01' },
  { title: 'Tắt Đèn', author: 'Ngô Tất Tố', description: 'Cuốn sách về cuộc sống khốn khó của người nông dân Việt Nam.', published_date: '1939-01-01' },

  { title: 'Nhật Ký Đặng Thùy Trâm', author: 'Đặng Thùy Trâm', description: 'Nhật ký của nữ bác sĩ trong cuộc chiến tranh Việt Nam.', published_date: '2005-07-01' },
  { title: 'Mắt Biếc', author: 'Nguyễn Nhật Ánh', description: 'Câu chuyện tình yêu đầy xúc cảm giữa Ngạn và Hà Lan.', published_date: '1990-01-01' },
  { title: 'Bến Không Chồng', author: 'Dương Hướng', description: 'Câu chuyện về những nỗi đau và mất mát sau chiến tranh.', published_date: '1988-01-01' },
  { title: 'Chí Phèo', author: 'Nam Cao', description: 'Một kiệt tác về sự tha hóa và nỗi đau khổ của con người.', published_date: '1941-01-01' },
  { title: 'Người Thầy Đầu Tiên', author: 'Chingiz Aitmatov', description: 'Một câu chuyện về người thầy và sức mạnh của giáo dục.', published_date: '1962-01-01' },
  { title: 'Những Tấm Lòng Cao Cả', author: 'Edmondo De Amicis', description: 'Câu chuyện cảm động về tình yêu thương giữa con người.', published_date: '1886-01-01' },
  { title: 'Đồi Gió Hú', author: 'Emily Brontë', description: 'Tác phẩm văn học kinh điển về tình yêu và trả thù.', published_date: '1847-01-01' },
  { title: 'Cuốn Theo Chiều Gió', author: 'Margaret Mitchell', description: 'Một câu chuyện tình yêu giữa chiến tranh.', published_date: '1936-06-30' },
  { title: 'Túp Lều Bác Tôm', author: 'Harriet Beecher Stowe', description: 'Cuộc chiến chống lại chế độ nô lệ tại Hoa Kỳ.', published_date: '1852-01-01' },
  { title: 'Không Gia Đình', author: 'Hector Malot', description: 'Câu chuyện về cuộc hành trình của cậu bé mồ côi Rémi.', published_date: '1878-01-01' },

  { title: 'Hoàng Tử Bé', author: 'Antoine de Saint-Exupéry', description: 'Câu chuyện đầy cảm động về tình yêu và lòng nhân ái.', published_date: '1943-01-01' },
  { title: 'Bố Già', author: 'Mario Puzo', description: 'Một tác phẩm kinh điển về thế giới mafia tại Mỹ.', published_date: '1969-03-10' },
  { title: 'Hạt Giống Tâm Hồn', author: 'Nhiều Tác Giả', description: 'Tập hợp các câu chuyện truyền cảm hứng về cuộc sống.', published_date: '2002-01-01' },
  { title: 'Nhà Thờ Đức Bà Paris', author: 'Victor Hugo', description: 'Một tác phẩm kinh điển về tình yêu và bi kịch.', published_date: '1831-01-01' },
  { title: 'Kẻ Trộm Sách', author: 'Markus Zusak', description: 'Câu chuyện cảm động trong thời kỳ Đức Quốc xã.', published_date: '2005-09-01' },
  { title: 'Ba Người Lính Ngự Lâm', author: 'Alexandre Dumas', description: 'Cuộc phiêu lưu của những người lính ngự lâm anh hùng.', published_date: '1844-01-01' },
  { title: 'Tiếng Chim Hót Trong Bụi Mận Gai', author: 'Colleen McCullough', description: 'Tình yêu và bi kịch trong gia đình người Úc.', published_date: '1977-01-01' },
  { title: 'Điều Kỳ Diệu', author: 'R.J. Palacio', description: 'Một câu chuyện về lòng bao dung và tình yêu thương.', published_date: '2012-02-14' },
  { title: 'Giết Con Chim Nhại', author: 'Harper Lee', description: 'Tác phẩm kinh điển về công lý và lòng nhân ái.', published_date: '1960-07-11' },
  { title: 'Những Người Khốn Khổ', author: 'Victor Hugo', description: 'Một câu chuyện về lòng nhân từ và sự chiến đấu cho công lý.', published_date: '1862-01-01' },
  { title: 'Lâu Đài Bay Của Pháp Sư Howl', author: 'Diana Wynne Jones', description: 'Cuộc phiêu lưu kỳ diệu của Sophie và Howl.', published_date: '1986-01-01' },
  
  // More books to reach 100...
];

async function bulkIndex() {
  const bulkOps = [];

  books.forEach(book => {
    bulkOps.push({ index: { _index: 'books' } });
    bulkOps.push(book);
  });

  try {
    const response = await esClient.bulk({ body: bulkOps });

    if (response.errors) {
      console.error('Bulk indexing errors:', response.errors);
    } else {
      console.log('Bulk indexing successful:', response);
    }
  } catch (error) {
    console.error('Error bulk indexing:', error);
  }
}

module.exports = bulkIndex
